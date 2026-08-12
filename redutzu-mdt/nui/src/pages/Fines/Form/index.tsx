import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';
import { useForm } from '../../../hooks/useForm';

// Form
import schema from '../../../schemas/fines';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import FormattedInput from '../../../components/FormattedInput';
import Button from '../../../components/Button';

// Assets
import './styles.scss';

const FinesForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            name: '',
            code: '',
            amount: ''
        },
        key: 'fine',
        schema: schema,
        permission: 'fines.create',
        submit: async (values) => {
            let response = await fetchNui('create', { 
                type: 'fines',
                event: 'fines:create',
                data: values
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('fines.notification.success.title') as string,
                message: t('fines.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/fine/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('fines.notification.error.title') as string,
            message: t('fines.notification.error.message') as string,
            autoClose: 5000
        })
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('fines.create')} autoComplete='off'>
            <Input 
                id='name'
                placeholder={t('fines.name')}
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.name && touched.name ? 'input-error' : ''}
                error={errors.name && touched.name ? errors.name as string : ''}
            />

            <FormattedInput 
                id='code'
                placeholder={t('fines.code', { format: window.CONFIG.CONSTANTS.CODE_FORMAT.LABEL })}
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

            <FormattedInput
                id='amount'
                placeholder={t('fines.amount')}
                onBlur={handleBlur}
                change={handleChange}
                value={values.amount}
                className={errors.amount && touched.amount ? 'input-error' : ''}
                error={errors.amount && touched.amount ? errors.amount as string : ''}
                format='currency'
                format_options={{
                    locale: window.CONFIG.DEFAULT_LOCALE,
                    currency: window.CONFIG.CURRENCY,
                    maxDecimals: 2,
                    liveUpdate: true
                }}
            />

            <Button label={t('fines.button')} type='submit' />
        </Form>
    );
}

export default FinesForm;
