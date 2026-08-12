import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../utils/misc';
import { useForm } from '../../../hooks/useForm';

// Components
import Form from '../../../components/Form';
import Textbox from '../../../components/Textbox';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import Autocomplete from '../../../components/Autocomplete';
import Button from '../../../components/Button';

// Form
import schema from '../../../schemas/warrants';

const WarrantForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();
    
    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            reason: '',
            description: '',
            wtype: '',
            house: [],
            players: [],
            done: 0
        },
        key: 'warrant',
        schema: schema,
        permission: 'warrants.create',
        submit: async (values) => {
            const data = {
                wtype: values.wtype,
                players: JSON.stringify(values.players.map((player: any) => ({
                    identifier: player.identifier,
                    firstname: player.firstname,
                    lastname: player.lastname,
                    phone_number: player.phone_number
                }))),
                house: values.house.length ? values.house[0].name : null,
                reason: values.reason,
                description: values.description,
                done: values.done
            };

            let response = await fetchNui('create', { 
                type: 'warrants',
                event: 'warrants:create',
                data: data
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('warrants.notification.success.title') as string,
                message: t('warrants.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/warrant/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('warrants.notification.error.title') as string,
            message: t('warrants.notification.error.message') as string,
            autoClose: 5000
        })
    });
    
    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('warrants.create')} autoComplete='off'>
            <Input 
                id='reason'
                placeholder={t('warrants.reason')}
                value={values.reason}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.reason && touched.reason ? 'input-error' : ''}
                error={errors.reason && touched.reason ? errors.reason as string : ''}
            />
            
            <Textbox 
                id='description'
                placeholder={t('warrants.description')}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.description && touched.description ? 'textbox-error' : ''}
                error={errors.description && touched.description ? errors.description : ''}
            />

            <Select
                id='wtype'
                placeholder={t('warrants.type')}
                selected={values.wtype && {
                    label: t(`warrants.types.${values.wtype}`),
                    value: values.wtype
                }}
                options={[
                    { label: t('warrants.types.search'), value: 'search' },
                    { label: t('warrants.types.arrest'), value: 'arrest' }
                ]}
                onBlur={handleBlur}
                onSelect={handleChange}
                className={errors.wtype && touched.wtype ? 'select-error' : ''}
                error={errors.wtype && touched.wtype ? errors.wtype as string : ''}
            />

            <Autocomplete
                input={{
                    id: 'players',
                    placeholder: t('warrants.players'),
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

            { 
                values.wtype === 'search' && (
                    <Autocomplete
                        input={{
                            id: 'house',
                            placeholder: t('warrants.house'),
                            disabled: values.house.length
                        }}
                        selected={values.house}
                        item={{ template: '{label}', icon: 'fa-solid fa-house' }}
                        result={{ template: '{label}' }}
                        identifier='name'
                        table='properties'
                        onSelect={handleChange}
                    />
                )
            }

            <Button label={t('warrants.button')} type='submit' />
        </Form>
    );
}

export default WarrantForm;
