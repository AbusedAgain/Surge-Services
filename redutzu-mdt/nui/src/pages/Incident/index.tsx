import React from 'react';
import { useQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { fetchNui, formatNumber } from '../../utils/misc';
import { fromNow } from '../../utils/date';
import { checkPermission } from '../../utils/permissions';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/incident';

// Components
import Page from '../../components/Page';
import TextBox from '../../components/Textbox';
import Tooltip from '../../components/Tooltip';
import SimpleList from '../../components/SimpleList';

// Assets
import './styles.scss';

const Incident: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();
    const parameters = useParams();

    const { isLoading, data } = useQuery(['incident', parameters.id], () =>
        fetchNui('search', {
            type: 'incident',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )

    const id = !isLoading ? data.id : 'Loading...';
    const name = !isLoading ? data.name : 'Loading...';
    const description = !isLoading ? data.description : 'Loading...';
    const players = !isLoading ? JSON.parse(data.players) : [];
    const cops = !isLoading ? JSON.parse(data.cops) : [];
    const vehicles = !isLoading ? JSON.parse(data.vehicles) : [];
    const evidences = !isLoading ? JSON.parse(data.evidences) : [];
    const jail = !isLoading ? JSON.parse(data.jail) : { amount: 0, reduction: 0, list: [] };
    const fines = !isLoading ? JSON.parse(data.fines) : { amount: 0, reduction: 0, list: [] };
    const createdAt = !isLoading ? data.createdAt : null;

    const { values, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { players, cops, vehicles, evidences, description },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('incidents.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'incident',
                id: parameters.id,
                values: {
                    players: JSON.stringify(values.players),
                    cops: JSON.stringify(values.cops),
                    vehicles: JSON.stringify(values.vehicles),
                    evidences: JSON.stringify(values.evidences),
                    description: values.description
                },
                event: 'incidents:update'
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('incidents.notification.update.title') as string,
                    message: t('incidents.notification.update.message', { id }) as string,
                    autoClose: 5000
                });
    
                return navigate('/incidents');
            });
        }
    });

    return (
        <Page header={{
            title: t('incidents.incident.title', { id }),
            subtitle: t('incidents.incident.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='incident'>
                <div className='info'>
                    <i className='fa-solid fa-shield-halved'></i>
                    <h1>{name}</h1>
                </div>
                <div className='description'>
                    <div className='title'>
                        <Tooltip text={t('incidents.tooltip.description')} position='right'>
                            <h1><Trans t={t}>incidents.description</Trans></h1>
                        </Tooltip>
                        <i className='fa-solid fa-floppy-disk' onClick={submitForm}></i>
                    </div>
                    <TextBox
                        id='description'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                    />
                </div>
                <div className='body'>
                    <SimpleList
                        id='players'
                        label={t('incidents.players')}
                        results={values.players}
                        icon='fa-solid fa-user'
                        main_template='{firstname} {lastname}'
                        secondary_template='{phone_number}'
                        redirect='/citizen/{identifier}'
                        onChange={handleChange}
                        modifiable
                    />

                    <SimpleList
                        id='cops'
                        label={t('incidents.cops')}
                        results={values.cops}
                        icon='fa-solid fa-user'
                        main_template='{firstname} {lastname}'
                        secondary_template='{phone_number}'
                        redirect='/citizen/{identifier}'
                        onChange={handleChange}
                        modifiable
                    />

                    <SimpleList
                        id='vehicles'
                        label={t('incidents.vehicles')}
                        results={values.vehicles}
                        icon='fa-solid fa-car'
                        main_template='{plate}'
                        redirect='/vehicle/{plate}'
                        onChange={handleChange}
                        modifiable
                    />

                    <SimpleList
                        label={t('incidents.evidences')}
                        results={evidences}
                        icon='fa-solid fa-file-lines'
                        main_template='{name}'
                        secondary_template='~createdAt~'
                        redirect='/evidence/{id}'
                    />

                    <SimpleList
                        label={t('incidents.fine_full', { amount: formatNumber(fines.amount), reduction: fines.reduction ? `(${fines.reduction}% ${t('incidents.reducted')})` : '' })}
                        results={fines.list}
                        icon='fa-solid fa-receipt'
                        main_template='{name} ({code})'
                        secondary_template='=amount=$'
                    />

                    <SimpleList
                        label={t('incidents.jail_full', { amount: formatNumber(jail.amount), reduction: jail.reduction ? `(${jail.reduction}% ${t('incidents.reducted')})` : '' })}
                        results={jail.list}
                        icon='fa-solid fa-handcuffs'
                        main_template='#{id} {name}'
                        secondary_template={`=time= ${t('words.months')}`}
                    />
                </div>
            </div>
        </Page>
    );
}

export default Incident;
