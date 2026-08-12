import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { fetchNui } from '../../../utils/misc';

// Types
import Alert from '../../../types/alert';

// Assets
import './styles.scss';

const Alerts: React.FC = () => {
    const { t } = useTranslation('translation');

    const { data } = useQuery('alerts', () =>
        fetchNui('GetAlerts')
            .then(data => data)
    )

    return (
        <div className='alerts-wrapper'>
            {
                (Array.isArray(data) && data.length > 0) && (
                    <div className='alerts-list'>
                        <div className='alerts-list-header'>
                            <h1><Trans t={t}>pages.alerts</Trans></h1>
                        </div>
                        <div className='alerts-items'>
                            {
                                data.map((alert: Alert, index: number) => (
                                    <div className='alert' key={index}>
                                        <h1>
                                            <i className='fas fa-location crosshairs' />
                                            &nbsp;{alert.label}
                                        </h1>
                                        <h2>{alert.description}</h2>
                                        <p>
                                            <i className='fas fa-map-location-dot' />
                                            <span>{alert.address}</span>
                                        </p>
                                    </div>                    
                                ))
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Alerts;
