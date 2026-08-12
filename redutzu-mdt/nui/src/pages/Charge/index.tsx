import React from 'react';
import { useQuery } from 'react-query';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { fromNow } from '../../utils/date';
import { checkPermission } from '../../utils/permissions';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/charges';

// Components
import Page from '../../components/Page';
import Form from '../../components/Form';
import Input from '../../components/Input';
import Slider from '../../components/Slider';
import Tooltip from '../../components/Tooltip';

import './styles.scss';

const Code: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['charge', parameters.id], () =>
        fetchNui('search', {
            type: 'charge',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )

    const id = !isLoading ? data.id : '0';
    const name = !isLoading ? data.name : 'Loading...';
    const time = !isLoading ? data.time : 0;
    const createdAt = !isLoading ? data.createdAt : null;

    const { values, errors, touched, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { name, time },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('charges.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'charge',
                id: id,
                values: {
                    name: values.name,
                    time: values.time
                },
                event: 'charges:update'
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('charges.notification.update.title') as string,
                    message: t('charges.notification.update.message', { id }) as string,
                    autoClose: 5000
                });
    
                return navigate('/charges');
            });
        }
    });

    return (
        <Page header={{
            title: t('charges.charge.title', { id }),
            subtitle: t('charges.charge.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='charge'>
                <div className='charge-icon'>
                    <i className='fa-solid fa-handcuffs'></i>
                    <h1>{name}</h1>
                </div>
                <div className='charge-information'>
                    <div className='title'>
                        <Tooltip text={t('common.tooltip.save')} position='right'>
                            <h1><Trans t={t}>words.information</Trans></h1>
                        </Tooltip>
                        <i className='fa-solid fa-floppy-disk' onClick={submitForm}></i>
                    </div>
                    <div className='data'>
                        <Form autoComplete='off'>
                            <Input
                                id='name'
                                placeholder={t('charges.name')}
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={errors.name && touched.name ? 'input-error' : ''}
                                error={errors.name && touched.name ? errors.name as string : ''}
                            />

                            <Slider
                                id='time'
                                min={1}
                                max={1000}
                                value={values.time}
                                label={t('charges.time', { time: values.time })}
                                onChange={handleChange}
                            />
                        </Form>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default Code;
