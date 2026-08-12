import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/vehicle';

// Components
import Page from '../../components/Page';
import Input from '../../components/Input';
import Tooltip from '../../components/Tooltip';
import SimpleList from '../../components/SimpleList';
import Badge from '../../components/Badge';
import Image from './Image';

// Assets
import './styles.scss';

const Vehicle: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['vehicle', parameters.plate], () =>
        fetchNui('search', {
            type: 'vehicle',
            query: parameters.plate,
            single: true
        })
        .then(async data => {
            let vehicle = JSON.parse(data.vehicle);
            let response = await fetchNui('GetVehicleData', {
                model: vehicle.model,
                plate: data.plate
            });

            return {
                ...data,
                ...response
            }
        })
    )

    const label = !isLoading ? data.label : 'Loading...';
    const owner = !isLoading ? data.owner : 'Loading...';
    const plate = !isLoading ? data.plate : 'Loading...';
    const incidents = !isLoading ? data.incidents : [];
    const bolos = !isLoading ? data.bolos : [];
    const mdt_image = !isLoading ? data.mdt_image : null;
    const mdt_description = !isLoading ? data.mdt_description : null;

    const { values, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: {
            notes: mdt_description || '',
            image: mdt_image || ''
        },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('vehicles.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'vehicle',
                identifierType: 'plate',
                plate: parameters.plate,
                values: {
                    mdt_description: values.notes
                }
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('vehicles.notification.update.title') as string,
                    message: t('vehicles.notification.update.message') as string,
                    autoClose: 5000
                });
    
                return navigate('/vehicles');
            });
        }
    });

    const navigateToOwner = () => navigate(`/citizen/${owner}`);

    return (
        <Page header={{
            title: t('vehicles.vehicle.title'),
            subtitle: t('vehicles.vehicle.subtitle'),
            backable: true
        }}>
           <div className='vehicle'>
                <div className='vehicle-header'>
                    <Image 
                        plate={parameters.plate}
                        mdt_image={values.image}
                        onChange={handleChange}
                    />
                    { 
                        bolos.filter((bolo: any) => bolo.status)
                            .length > 0 && 
                            <Badge label={t('vehicles.wanted')} type='error' />
                    }
                    <h1>{label}</h1>
                </div>
                <div className='information'>
                    <div className='title'>
                        <Tooltip text={t('common.tooltip.save')} position='right'>
                            <h1><Trans t={t}>words.information</Trans></h1>
                        </Tooltip>
                        <i className='fa-solid fa-floppy-disk' onClick={submitForm}></i>
                    </div>
                    <div className='content'>
                        <p><b><Trans t={t}>words.name</Trans>:</b>{label}</p>
                        <p><b><Trans t={t}>vehicles.owned</Trans>:</b>
                            {
                                owner ? 
                                    <Tooltip text={t('common.tooltip.visit')} position='right'>
                                        <p>
                                            <Trans t={t}>words.yes</Trans>
                                            <i className='fa-solid fa-diamond-turn-right' onClick={navigateToOwner}></i>
                                        </p>
                                    </Tooltip> 
                                : <Trans t={t}>words.no</Trans>
                            }
                        </p>
                        <p><b><Trans t={t}>vehicles.plate</Trans>:</b>{plate}</p>
                        <Input
                            id='notes'
                            placeholder={t('words.notes')}
                            value={values.notes || ''}
                            maxLength={300}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
                <div className='body'>
                    <SimpleList 
                        label={t('vehicles.incidents')}
                        results={incidents}
                        icon='fa-solid fa-shield-halved'
                        main_template='#{id} {name}'
                        secondary_template='~createdAt~'
                        redirect='/incident/{id}'
                    />
                    <SimpleList 
                        label={t('vehicles.bolos')}
                        results={bolos}
                        icon='fa-solid fa-person-circle-exclamation'
                        main_template='#{id} {title}'
                        secondary_template='~createdAt~'
                        redirect='/bolo/{id}'
                    />
                </div>
           </div>
        </Page>
    );
}

export default Vehicle;
