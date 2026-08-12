import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';

// Form
import { useForm } from '../../../hooks/useForm';
import schema from '../../../schemas/codes';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import FormattedInput from '../../../components/FormattedInput';
import Button from '../../../components/Button';

import './styles.scss';

const CodesForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            name: '',
            code: ''
        },
        key: 'code',
        schema: schema,
        permission: 'codes.create',
        submit: async (values) => {
            let response = await fetchNui('create', { 
                type: 'codes',
                event: 'codes:create',
                data: values
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('codes.notification.success.title') as string,
                message: t('codes.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/code/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('codes.notification.error.title') as string,
            message: t('codes.notification.error.message') as string,
            autoClose: 5000
        })
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('codes.create')} autoComplete='off'>
            <Input 
                id='name'
                placeholder={t('codes.name')}
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.name && touched.name ? 'input-error' : ''}
                error={errors.name && touched.name ? errors.name as string : ''}
            />

            <FormattedInput 
                id='code'
                placeholder={t('codes.format', { format: window.CONFIG.CONSTANTS.CODE_FORMAT.LABEL })}
                onBlur={handleBlur}
                change={handleChange}
                value={values.code}
                className={errors.code && touched.code ? 'input-error' : ''}
                error={errors.code && touched.code ? errors.code as string : ''}
                format='mask'
                format_options={{
                    mask: window.CONFIG.CONSTANTS.CODE_FORMAT.MASK,
                    allowedChars: /[0-9]/,
                    liveUpdate: true,
                    same: true
                }}
            />
            
            <Button label={t('codes.button')} type='submit' />
        </Form>
    );
}

export default CodesForm;
