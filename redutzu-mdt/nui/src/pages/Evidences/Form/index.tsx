import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';

// Components
import Form from '../../../components/Form';
import Textbox from '../../../components/Textbox';
import Input from '../../../components/Input';
import Autocomplete from '../../../components/Autocomplete';
import ImageZone from '../../../components/ImageZone';
import Button from '../../../components/Button';

// Form
import { useForm } from '../../../hooks/useForm';
import schema from '../../../schemas/evidences';

const EvidenceForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            name: '',
            description: '',
            players: [],
            images: []
        },
        key: 'evidence',
        schema: schema,
        permission: 'evidences.create',
        submit: async (values) => {
            const data = {
                name: values.name,
                description: values.description,
                players: JSON.stringify(values.players.map((player: any) => ({
                    identifier: player.identifier,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    phone_number: player.phone_number
                }))),
                images: JSON.stringify(values.images)
            };

            let response = await fetchNui('create', { 
                type: 'evidences',
                event: 'evidences:create',
                data: data
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('evidences.notification.success.title') as string,
                message: t('evidences.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/evidence/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('evidences.notification.error.title') as string,
            message: t('evidences.notification.error.message') as string,
            autoClose: 5000
        })
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('evidences.create')} autoComplete='off'>
            <Input 
                id='name'
                placeholder={t('evidences.name')}
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.name && touched.name ? 'input-error' : ''}
                error={errors.name && touched.name ? errors.name as string : ''}
            />
            
            <Textbox 
                id='description'
                placeholder={t('evidences.description')}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.description && touched.description ? 'textbox-error' : ''}
                error={errors.description && touched.description ? errors.description : ''}
            />

            <Autocomplete
                input={{
                    id: 'players',
                    placeholder: t('evidences.players'),
                    className: errors.players && touched.players ? 'input-error' : '',
                    error: errors.players && touched.players ? errors.players : ''
                }}
                selected={values.players}
                item={{ template: '{firstname} {lastname}', icon: 'fa-solid fa-user' }}
                result={{ template: '{firstname} {lastname}' }}
                identifier='identifier'
                table='players'
                onSelect={handleChange}
            />

            <ImageZone
                id='images'
                value={values.images}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.images as string}
                touched={touched.images as boolean}
            />

            <Button label={t('evidences.button')} type='submit' />
        </Form>
    );
}

export default EvidenceForm;
