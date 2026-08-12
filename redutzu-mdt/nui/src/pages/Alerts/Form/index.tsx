import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { useForm } from '../../../hooks/useForm';
import { fetchNui } from '../../../utils/misc';

// Schema
import schema from '../../../schemas/alert';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import Textbox from '../../../components/Textbox';
import Button from '../../../components/Button';
import Alerts from '../Alerts';

const AlertForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            title: '',
            description: ''
        },
        key: 'alert',
        schema: schema,
        permission: 'alerts.create',
        submit: async (values) => await fetchNui('CreateAlert', values),
        onSuccess: () => {
            showNotification({
                title: t('alerts.notification.sent.title') as string,
                message: t('alerts.notification.sent.message') as string,
                autoClose: 5000
            });

            return navigate('/alerts');
        }
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('alerts.form')} autoComplete='off'>
            <Input 
                id='title'
                placeholder={t('alerts.name')}
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.title && touched.title ? 'input-error' : ''}
                error={errors.title && touched.title ? errors.title as string : ''}
            />
                        
            <Textbox 
                id='description'
                placeholder={t('alerts.description')}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.description && touched.description ? 'textbox-error' : ''}
                error={errors.description && touched.description ? errors.description : ''}
            /> 
                        
            <Button label={t('alerts.button')} type='submit' />
            <Alerts />
        </Form>
    );
}

export default AlertForm;
