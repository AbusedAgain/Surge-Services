import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';
import { useForm } from '../../../hooks/useForm';

// Form
import schema from '../../../schemas/charges';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import Slider from '../../../components/Slider';
import Button from '../../../components/Button';

import './styles.scss';

const ChargesForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            name: '',
            time: 1
        },
        key: 'charge',
        schema: schema,
        permission: 'charges.create',
        submit: async (values) => {
            let response = await fetchNui('create', { 
                type: 'charges',
                event: 'charges:create',
                data: values
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('charges.notification.success.title') as string,
                message: t('charges.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/charge/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('charges.notification.error.title') as string,
            message: t('charges.notification.error.message') as string,
            autoClose: 5000
        })
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('charges.create')} autoComplete='off'>
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

            <Button label={t('charges.button')} type='submit' />
        </Form>
    );
}

export default ChargesForm;
