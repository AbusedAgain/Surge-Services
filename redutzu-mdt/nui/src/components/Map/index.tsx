import React, { useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Leaflet, { extend, LatLngExpression, Projection, Transformation } from 'leaflet';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { fetchNui } from '../../utils/misc';
import { useEvent } from '../../hooks/useEvent';
import { checkPermission } from '../../utils/permissions';
import { useLocalStorage } from '../../hooks/useLocalStorage';

// Types
import Alert from '../../types/alert';

// Components
import Button from '../Button';
import Switch from '../Switch';

// Assets

import './styles.scss';
import 'leaflet/dist/leaflet.css';

const AlertIcon = Leaflet.icon({
    iconUrl: require('../../assets/marker.png'),
    iconSize: [40, 40]
});

const CopIcon = Leaflet.icon({
    iconUrl: require('../../assets/cop_marker.png'),
    iconSize: [40, 40]
});

// Constants

const CENTER_X = 117.3;
const CENTER_Y = 172.8;
const SCALE_X = 0.02072;
const SCALE_Y = 0.0205;
const MAX_BOUNDS: [[number, number], [number, number]] = [[8000.0, -4000.0], [-4000.0, 4000.0]];

const Map: React.FC = () => {
    const { t } = useTranslation('translation');
    const queryCache = useQueryClient();

    const [alerts_blips, setAlertsBlips] = useLocalStorage('alerts-blips', false);
    const [officers_blips, setOfficersBlips] = useLocalStorage('officers-blips', false);

    const CRS = extend({}, Leaflet.CRS.Simple, {
        projection: Projection.LonLat,
        scale: (zoom: number) => Math.pow(2, zoom),
        zoom: (sc: number) => Math.log(sc) / 0.6931471805599453,
        distance: (postion: any, target: any) => {
            let x_difference: number = target.lng - postion.lng;
            let y_difference: number = target.lat - postion.lat;
            return Math.sqrt(x_difference * x_difference + y_difference * y_difference);
        },
        transformation: new Transformation(SCALE_X, CENTER_X, -SCALE_Y, CENTER_Y),
        infinite: true
    });

    // Alerts
    const alerts = useQuery('alerts', () => {
        if (alerts_blips) 
            return fetchNui('GetAlerts')
                .then(data => data)
    });

    useEvent('SetAlerts', () => {
        if (alerts_blips)
            return alerts.refetch();
    });
    
    const alerts_markers = Array.isArray(alerts.data) ? alerts.data.map((alert: Alert) => {
        const coords = JSON.parse(alert.coords);

        return {
            position: [coords.y, coords.x],
            label: `#${alert.id} ${alert.label} | ${alert.description} | ${alert.address}`,
            data: alert
        }
    }) : [];

    const alerts_actions = useMutation({
        mutationFn: async (alert: Alert) => {
            let permission = await checkPermission('alerts.take', t);
            if (!permission) return;

            return fetchNui('TakeAlert', { id: alert.id })
                .then(data => data)
        },
        onSuccess: () => queryCache.invalidateQueries('alerts')
    });

    // Officers
    const officers = useQuery('officers_position', () => {
        if (officers_blips) 
            return fetchNui('GetOfficersPosition')
                .then(data => data)
    });

    useEffect(() => {
        if (officers_blips) {
            setTimeout(officers.refetch, 1000);
        }
    }, [officers.data]);

    const officers_markers = Array.isArray(officers.data) ? officers.data.map((officer: any) => {
        const coords = JSON.parse(officer.coords); 

        return {
            position: [coords.y, coords.x],
            label: `${officer.name.firstname} ${officer.name.lastname}`
        }
    }) : [];

    return (
        <div className='map-wrapper'>
            <div className='map-settings'>
                <div className='map-settings-header'>
                    <h1><Trans t={t}>alerts.map_settings</Trans></h1>
                </div>
                <div className='map-settings-content'>
                    <div className='map-setting'>
                        <p><Trans t={t}>pages.alerts</Trans>: </p>
                        <Switch id='alerts' checked={alerts_blips} onChange={()=> setAlertsBlips(!alerts_blips)} />
                    </div>
                    <div className='map-setting'>
                        <p><Trans t={t}>pages.officers</Trans>: </p>
                        <Switch id='officers' checked={officers_blips} onChange={() => setOfficersBlips(!officers_blips)} />
                    </div>
                </div>
            </div>
            <MapContainer
                className='game-map'
                crs={CRS}
                minZoom={3}
                maxZoom={5}
                preferCanvas={true}
                center={[0, 0]}
                zoom={4}
                zoomControl={false}
                maxBounds={MAX_BOUNDS}
            >
                <TileLayer noWrap url={window.CONFIG.CONSTANTS.MAP_API} />
                {
                    alerts_blips && (
                        alerts_markers.map((marker, index: number) => (
                            <Marker position={marker.position as LatLngExpression} icon={AlertIcon} key={index}>
                                <Popup>
                                    <h1><Trans>alerts.notification.take.message</Trans></h1>

                                    <p>{marker.label}</p>

                                    <Button 
                                        label={t('words.yes')}
                                        style={{ width: '100%' }}
                                        onClick={() => alerts_actions.mutate(marker.data)}
                                    />
                                </Popup>
                            </Marker>
                        ))
                    )
                }
                {
                    officers_blips && (
                        officers_markers.map((marker, index: number) => (
                            <Marker position={marker.position as LatLngExpression} icon={CopIcon} key={index}>
                                <Popup closeButton={false}>
                                    <h1>{marker.label}</h1>
                                </Popup>
                            </Marker>
                        ))
                    )
                }
            </MapContainer>
        </div>
    );
}

export default Map;