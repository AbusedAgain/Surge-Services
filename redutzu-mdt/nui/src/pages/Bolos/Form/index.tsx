import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Utils
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';

// Form
import { useForm } from '../../../hooks/useForm';
import schema from '../../../schemas/bolos';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import Textbox from '../../../components/Textbox';
import Autocomplete from '../../../components/Autocomplete';
import Select from '../../../components/Select';
import Button from '../../../components/Button';

const BoloForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            title: '',
            description: '',
            bolo_type: 'people',
            players: [],
            vehicles: []
        },
        key: 'bolo',
        schema: schema,
        permission: 'bolos.create',
        submit: async (values) => {
            const data = {
                title: values.title,
                description: values.description,
                bolo_type: values.bolo_type,
                players: JSON.stringify(values.players.map((player: any) => ({
                    identifier: player.identifier,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    phone_number: player.phone_number
                }))),
                vehicles: JSON.stringify(values.vehicles.map((vehicle: any) => ({
                    plate: vehicle.plate,
                    owner: vehicle.owner
                })))
            };

            let response = await fetchNui('create', { 
                type: 'bolos',
                event: 'bolos:create',
                data: data
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('bolos.notification.success.title') as string,
                message: t('bolos.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/bolo/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('bolos.notification.error.title') as string,
            message: t('bolos.notification.error.message') as string,
            autoClose: 5000
        })
    });

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('bolos.create')} autoComplete='off'>
            <Input 
                id='title'
                placeholder={t('bolos.name')}
                value={values.title}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.title && touched.title ? 'input-error' : ''}
                error={errors.title && touched.title ? errors.title as string : ''}
            />

            <Textbox 
                id='description'
                placeholder={t('bolos.description')}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.description && touched.description ? 'textbox-error' : ''}
                error={errors.description && touched.description ? errors.description : ''}
            />

            <Select
                id='bolo_type'
                placeholder={t('bolos.type')}
                selected={values.bolo_type && {
                    label: t(`bolos.types.${values.bolo_type}`),
                    value: values.bolo_type
                }}
                options={[
                    { label: t('bolos.types.people'), value: 'people' },
                    { label: t('bolos.types.vehicles'), value: 'vehicles' }
                ]}
                onBlur={handleBlur}
                onSelect={handleChange}
                className={errors.bolo_type && touched.bolo_type ? 'select-error' : ''}
                error={errors.bolo_type && touched.bolo_type ? errors.bolo_type as string : ''}
            />

            { 
                values.bolo_type == 'people' ? (
                    <Autocomplete
                        input={{
                            id: 'players',
                            placeholder: t('bolos.players'),
                            className: errors.players && touched.players ? 'input-error' : '',
                            error: errors.players && touched.players ? errors.players : ''
                        }}
                        max_selected={1}
                        selected={values.players}
                        item={{ template: '{firstname} {lastname}', icon: 'fa-solid fa-user' }}
                        result={{ template: '{firstname} {lastname}' }}
                        identifier='citizenid'
                        table='players'
                        onSelect={handleChange}
                    />
                ) : (
                    <Autocomplete 
                        input={{
                            id: 'vehicles',
                            placeholder: t('bolos.vehicles')
                        }}
                        max_selected={1}
                        selected={values.vehicles}
                        item={{ template: '{plate}', icon: 'fa-solid fa-car' }}
                        result={{ template: '{plate}' }}
                        identifier='plate'
                        table='vehicles'
                        onSelect={handleChange}
                    />
                )
            }

            <Button label={t('bolos.button')} type='submit' />
        </Form>
    );
}

export default BoloForm;