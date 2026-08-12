import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Utils
import { showNotification } from '@mantine/notifications';
import { formatNumber, fetchNui } from '../../../utils/misc';

// Form
import { useForm } from '../../../hooks/useForm';
import schema from '../../../schemas/incidents';

// Components
import Form from '../../../components/Form';
import Input from '../../../components/Input';
import Textbox from '../../../components/Textbox';
import Autocomplete from '../../../components/Autocomplete';
import Button from '../../../components/Button';
import Slider from '../../../components/Slider';

const IncidentForm: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const [fine_amount, setFine] = useState<number>(0);
    const [jail_amount, setJail] = useState<number>(0);

    const { values, errors, touched, clearValues, handleBlur, handleChange, handleSubmit } = useForm({
        initialValues: {
            name: '',
            description: '',
            players: [],
            cops: [],
            vehicles: [],
            evidences: [],
            fines: [],
            jail: [],
            fine_reduction: 0,
            jail_reduction: 0
        },
        key: 'incident',
        schema: schema,
        permission: 'incidents.create',
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
                cops: JSON.stringify(values.cops.map((cop: any) => ({
                    identifier: cop.identifier,
                    firstname: cop.firstname,
                    lastname: cop.lastname,
                    phone_number: cop.phone_number
                }))),
                vehicles: JSON.stringify(values.vehicles.map((vehicle: any) => ({
                    plate: vehicle.plate,
                    owner: vehicle.owner
                }))),
                evidences: JSON.stringify(values.evidences.map((evidence: any) => ({
                    id: evidence.id,
                    name: evidence.name,
                    createdAt: evidence.createdAt
                }))),
                fines: JSON.stringify({
                    list: values.fines,
                    amount: fine_amount,
                    reduction: values.fine_reduction
                }),
                jail: JSON.stringify({
                    list: values.jail,
                    amount: jail_amount,
                    reduction: values.jail_reduction
                })
            };

            let response = await fetchNui('create', { 
                type: 'incidents',
                event: 'incidents:create',
                data: data
            });

            return response;
        },
        onSuccess: (response) => {
            showNotification({
                title: t('incidents.notification.success.title') as string,
                message: t('incidents.notification.success.message', { id: response.data }) as string,
                autoClose: 5000
            });

            return navigate(`/incident/${response.data}`);
        },
        onFail: () => showNotification({
            title: t('incidents.notification.error.title') as string,
            message: t('incidents.notification.error.message') as string,
            autoClose: 5000
        })
    });

    useEffect(() => {
        let fine: number = values.fines.reduce((total: number, fine: any) => total + fine.amount, 0);
        let jail: number = values.jail.reduce((total: number, jail: any) => total + jail.time, 0);
        let total_fine: number = fine - (fine * (values.fine_reduction / 100));
        let total_jail: number = jail - (jail * (values.jail_reduction / 100));
        setFine(Math.floor(total_fine));
        setJail(Math.floor(total_jail));
    }, [values.jail, values.fines, values.fine_reduction, values.jail_reduction]);

    return (
        <Form onSubmit={handleSubmit} clearValues={clearValues} label={t('incidents.create')} autoComplete='off'>
            <Input 
                id='name'
                placeholder={t('incidents.name')}
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.name && touched.name ? 'input-error' : ''}
                error={errors.name && touched.name ? errors.name as string : ''}
            />
            
            <Textbox 
                id='description'
                placeholder={t('incidents.description')}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
                className={errors.description && touched.description ? 'textbox-error' : ''}
                error={errors.description && touched.description ? errors.description : ''}
            />
            
            <Autocomplete
                input={{
                    id: 'players',
                    placeholder: t('incidents.players'),
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

            <Autocomplete 
                input={{
                    id: 'cops',
                    placeholder: t('incidents.cops'),
                    className: errors.cops && touched.cops ? 'input-error' : '',
                    error: errors.cops && touched.cops ? errors.cops : ''
                }}
                selected={values.cops}
                item={{ template: '{firstname} {lastname}', icon: 'fa-solid fa-user-shield' }}
                result={{ template: '{firstname} {lastname}' }}
                identifier='identifier'
                table='cops'
                onSelect={handleChange}
            />
            
            <Autocomplete 
                input={{
                    id: 'vehicles',
                    placeholder: t('incidents.vehicles')
                }}
                selected={values.vehicles}
                item={{ template: '{plate}', icon: 'fa-solid fa-car' }}
                result={{ template: '{plate}' }}
                identifier='plate'
                table='vehicles'
                onSelect={handleChange}
            />

            <Autocomplete 
                input={{
                    id: 'evidences',
                    placeholder: t('incidents.evidences')
                }}
                selected={values.evidences}
                item={{ template: '#{id} {name}', icon: 'fa-solid fa-file-lines' }}
                result={{ template: '#{id} {name}' }}
                identifier='id'
                table='evidences'
                onSelect={handleChange}
            />
            
            {values.fines.length ? (
                <Slider 
                    id='fine_reduction'
                    value={values.fine_reduction}
                    label={t('incidents.fine_reduction', { amount: formatNumber(fine_amount) })}
                    onChange={handleChange}
                />
            ) : null}

            <Autocomplete 
                input={{
                    id: 'fines',
                    placeholder: t('incidents.fines')
                }}
                selected={values.fines}
                item={{ template: '({code}) {name}', icon: 'fa-solid fa-receipt' }}
                result={{ template: '({code}) {name} [=amount=$]' }}
                identifier='id'
                table='fines'
                onSelect={handleChange}
                allow_duplicates
            />
            
            {values.jail.length ? (
                <Slider
                    id='jail_reduction'
                    value={values.jail_reduction}
                    label={t('incidents.jail_reduction', { amount: jail_amount })}
                    onChange={handleChange}
                />
            ) : null}

            <Autocomplete 
                input={{
                    id: 'jail',
                    placeholder: t('incidents.jail')
                }}
                selected={values.jail}
                item={{ template: `{name} ({time} ${t('words.months')})`, icon: 'fa-solid fa-handcuffs' }}
                result={{ template: `{name} ({time} ${t('words.months')})` }}
                identifier='id'
                table='jail'
                onSelect={handleChange}
                allow_duplicates
            />

            <Button label={t('incidents.button')} type='submit' />
        </Form>
    );
}

export default IncidentForm;
