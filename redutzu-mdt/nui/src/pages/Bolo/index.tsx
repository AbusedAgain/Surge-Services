import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { fetchNui } from '../../utils/misc';
import { fromNow } from '../../utils/date';
import { checkPermission } from '../../utils/permissions';

// Modals
import Modals from '../../contexts/Modal';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/incident';

// Components
import Page from '../../components/Page';
import TextBox from '../../components/Textbox';
import Tooltip from '../../components/Tooltip';
import SimpleList from '../../components/SimpleList';
import Badge from '../../components/Badge';

// Assets
import './styles.scss';

const Bolo: React.FC = () => {
    const { createModal } = useContext(Modals);
    const { t } = useTranslation('translation');
    const navigate = useNavigate();
    const parameters = useParams();

    const { isLoading, data } = useQuery(['bolo', parameters.id], () =>
        fetchNui('search', {
            type: 'bolo',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )

    const id = !isLoading ? data.id : 'Loading...';
    const title = !isLoading ? data.title : 'Loading...';
    const description = !isLoading ? data.description : 'Loading...';
    const players = !isLoading ? JSON.parse(data.players) : [];
    const vehicles = !isLoading ? JSON.parse(data.vehicles) : [];
    const status = !isLoading ? data.status : 0;
    const createdAt = !isLoading ? data.createdAt : null;

    const endBOLO = async () => {
        let permission = await checkPermission('bolos.edit', t);
        if (!permission) return;

        createModal({
            title: t('bolos.modal.end.title'),
            description: t('bolos.modal.end.message'),
            icon: 'fa-solid fa-check-double',
            onClick: async () => {
                let request = await fetchNui('update', {
                    type: 'bolo',
                    id: parameters.id,
                    values: { status: 0 },
                    event: 'bolos:end'
                });

                if (!request.status) return;

                showNotification({
                    title: t('bolos.notification.end.title') as string,
                    message: t('bolos.notification.end.message', { id }) as string,
                    autoClose: 5000
                });

                return navigate('/bolos');
            }
        }) 
    }

    const { values, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { description, players, vehicles },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('incidents.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'bolo',
                id: parameters.id,
                values: {
                    description: values.description,
                    players: JSON.stringify(values.players),
                    vehicles: JSON.stringify(values.vehicles)
                },
                event: 'bolos:update'
            });

            request.then(response => {
                if (!response.status) return;

                showNotification({
                    title: t('bolos.notification.update.title') as string,
                    message: t('bolos.notification.update.message', { id }) as string,
                    autoClose: 5000
                });

                return navigate('/bolos');
            });
        }
    });

    return (
        <Page header={{
            title: t('bolos.bolo.title', { id: id }),
            subtitle: t('bolos.bolo.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='bolo'>
                <div className='info'>
                    <i className='fa-solid fa-triangle-exclamation'></i>
                    <h1>{title}</h1>
                    { status == 0 && <Badge label={t('bolos.ended')} type='error' /> }
                </div>
                <div className='description'>
                    <div className='title'>
                        <Tooltip text={t('bolos.tooltip.description')} position='right'>
                            <h1><Trans t={t}>bolos.description</Trans></h1>
                        </Tooltip>
                        <i className='fa-solid fa-floppy-disk' onClick={submitForm}></i>
                        { 
                            status > 0 && (
                                <Tooltip text={t('bolos.tooltip.end')} position='bottom'>
                                    <i className='fa-solid fa-square-check' onClick={endBOLO}></i> 
                                </Tooltip>
                            )
                        }
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
                        label={t('bolos.players')}
                        results={values.players}
                        icon='fa-solid fa-user'
                        main_template='{firstname} {lastname}'
                        secondary_template='{phone_number}'
                        redirect='/citizen/{identifier}'
                    />
                    <SimpleList
                        label={t('bolos.vehicles')}
                        results={values.vehicles}
                        icon='fa-solid fa-car'
                        main_template='{plate}'
                        redirect='/vehicle/{plate}'
                    />
                </div>
            </div>
        </Page>
    );
}

export default Bolo;