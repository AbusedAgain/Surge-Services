import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';

// Components
import Page from '../../components/Page';
import Tooltip from '../../components/Tooltip';
import SimpleList from '../../components/SimpleList';

// Assets
import './styles.scss';

const House: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['house', parameters.id], () =>
        fetchNui('GetHouseData', parameters.id)
            .then(data => data)
    )

    const id = !isLoading ? data.id : '0';
    const label = !isLoading ? data.label : 'Loading...';
    const street = !isLoading ? data.street : 'Loading...';
    const owner = !isLoading ? data.owner : false;
    const warrants = !isLoading ? data.warrants : [];
    const coords = !isLoading ? JSON.stringify(data.coords) : null;

    const locateHouse = () => {
        fetchNui('SetWaypoint', coords);
        fetchNui('hide');

        showNotification({
            title: t('houses.notification.location.title') as string,
            message: t('houses.notification.location.message') as string,
            autoClose: 5000
        });
    };

    const navigateToOwner = () => navigate(`/citizen/${owner}`);

    return (
        <Page header={{
            title: t('houses.house.title', { id }),
            subtitle: t(street ? 'houses.house.subtitle' : 'houses.house.placeholder', { address: street }),
            backable: true
        }}>
            <div className='house'>
                <div className='house-header'>
                    <i className='fa-solid fa-house'></i>
                    <h1>{label}</h1>
                </div>
                <div className='house-information'>
                    <h1><Trans t={t}>words.information</Trans></h1>
                    <div className='data'>
                        <p><b><Trans t={t}>words.name</Trans>:</b>{label}</p>
                        { 
                            street && (
                                <p>
                                    <b><Trans t={t}>words.street</Trans>:</b>{street}
                                    <Tooltip text='Click here to set a waypoint to this property' position='right'>
                                        <i className='fa-solid fa-location-arrow' onClick={locateHouse}></i>
                                    </Tooltip>
                                </p>
                            )
                        }
                        <p>
                            <b><Trans t={t}>houses.owned</Trans>:</b>{
                                owner ? (
                                    <Tooltip text={t('common.tooltip.visit')} position='right'>
                                        <p>
                                            <Trans t={t}>words.yes</Trans>
                                            <i className='fa-solid fa-diamond-turn-right' onClick={navigateToOwner}></i>
                                        </p>
                                    </Tooltip>
                                ) : <Trans t={t}>words.no</Trans>
                            }
                        </p>
                    </div>
                </div>
                <div className='house-body'>
                    <SimpleList
                        label={t('words.warrants')}
                        results={warrants}
                        icon='fa-solid fa-folder'
                        main_template='{reason}'
                        secondary_template='(~createdAt~)'
                        redirect='/warrant/{id}'
                    />
                </div>
            </div>
        </Page>
    );
}

export default House;
