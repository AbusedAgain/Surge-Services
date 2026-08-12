import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';

// Form
import { useForm } from '../../../hooks/useForm';
import schema from '../../../schemas/announcements';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import TextEditor from '../../../components/TextEditor';

const AnnouncementForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            title: '',
            content: ''
        },
        key: 'announcement',
        schema: schema,
        permission: 'announcements.create',
        submit: async (values) => {
            let response = await fetchNui('create', { 
                type: 'announcements',
                event: 'announcements:create',
                dataMiddleware: 'announcement_middleware',
                data: {
                    title: values.title,
                    content: values.content
                }
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('announcements.notification.success.title') as string,
                message: t('announcements.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/announcement/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('announcements.notification.error.title') as string,
            message: t('announcements.notification.error.message') as string,
            autoClose: 5000
        })
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('announcements.create')} autoComplete='off'>
            <Input 
                id='title'
                placeholder={t('announcements.name')}
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.title && touched.title ? 'input-error' : ''}
                error={errors.title && touched.title ? errors.title as string : ''}
            />

            <TextEditor
                id='content'
                value={values.content}
                onBlur={handleBlur}
                onChange={handleChange}
            />

            <Button label={t('announcements.button')} type='submit' />
        </Form>
    );
}

export default AnnouncementForm;
