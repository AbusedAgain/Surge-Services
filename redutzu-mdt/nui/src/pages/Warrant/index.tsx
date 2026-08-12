import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { fromNow } from '../../utils/date';
import { checkPermission } from '../../utils/permissions';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/warrant';

// Components
import Page from '../../components/Page';
import Input from '../../components/Input';
import Tooltip from '../../components/Tooltip';
import SimpleList from '../../components/SimpleList';
import Switch from '../../components/Switch';

// Assets
import './styles.scss';

const Warrant: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['warrant', parameters.id], () =>
        fetchNui('search', {
            type: 'warrant',
            query: parameters.id,
            single: true
        })
        .then(async data => {
            if (data.house) {
                let response = await fetchNui('GetWarrantHouse', data.house);
                data.house = response;
            }

            return data;
        })
    )

    const id = !isLoading ? data.id : '0';
    const wtype = !isLoading ? data.wtype : 'Loading...';
    const description = !isLoading ? data.description : 'Loading...';
    const reason = !isLoading ? data.reason : 'Loading...';
    const done = !isLoading ? data.done : 0;
    const players = !isLoading ? JSON.parse(data.players) : [];
    const house = !isLoading ? data.house : { label: 'Loading...', id: '0' };
    const createdAt = !isLoading ? data.createdAt : null;

    const { values, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { players, description, done },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('warrants.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'warrant',
                id: id,
                values: {
                    players: JSON.stringify(values.players),
                    description: values.description,
                    done: values.done ? 1 : 0
                },
                event: 'warrants:update'
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('warrants.notification.update.title') as string,
                    message: t('warrants.notification.update.message', { id }) as string,
                    autoClose: 5000
                });
    
                return navigate('/warrants');
            });
        }
    });

    const locateHouse = () => navigate(`/house/${house.id}`);

    return (
        <Page header={{
            title: t('warrants.warrant.title', { id }),
            subtitle: t('warrants.warrant.subtitle', { date: fromNow(createdAt) }),
            backable: true    
        }}>
           <div className='warrant'>
                <div className='warrant-icon'>
                    <i className='fa-solid fa-folder-open'></i>
                    <h1>{reason}</h1>
                    { done && <p className='alert'><Trans t={t}>warrants.done</Trans></p> }
                </div>
                <div className='warrant-information'>
                    <div className='title'>
                        <Tooltip text={t('common.tooltip.save')} position='right'>
                            <h1><Trans t={t}>words.information</Trans></h1>
                        </Tooltip>
                        <i className='fa-solid fa-floppy-disk' onClick={submitForm}></i>
                    </div>
                    <div className='data'>
                        <p><b><Trans t={t}>warrants.reason</Trans>:</b>{reason}</p>
                        <p><b><Trans t={t}>warrants.type</Trans>:</b><Trans t={t}>warrants.types.{wtype}</Trans></p>
                        <p><b><Trans t={t}>warrants.done</Trans>:</b><Switch id='done' checked={!!values.done} onChange={handleChange} /></p>
                        { 
                            wtype === 'search' && data.house ? (
                                <p>
                                    <b><Trans t={t}>words.house</Trans>:</b>{house.label}
                                    <Tooltip text={t('common.tooltip.waypoint')} position='right'>
                                        <i className='fa-solid fa-location-arrow' onClick={locateHouse}></i>
                                    </Tooltip>
                                </p>
                            ) : null
                        }
                        <Input
                            id='description'
                            placeholder={t('words.description')}
                            value={values.description}
                            maxLength={300}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
                <div className='body'>
                    <SimpleList
                        id='players'
                        label={t('warrants.players')}
                        results={values.players}
                        icon='fa-solid fa-user'
                        main_template='{firstname} {lastname}'
                        secondary_template='{phone_number}'
                        redirect='/citizen/{identifier}'
                        onChange={handleChange}
                        modifiable
                    />
                </div>
            </div>
        </Page>
    );
}

export default Warrant;
