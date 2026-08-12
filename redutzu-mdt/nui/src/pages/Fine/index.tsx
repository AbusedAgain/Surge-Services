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
import schema from '../../schemas/fines';

// Components
import Page from '../../components/Page';
import Form from '../../components/Form';
import Input from '../../components/Input';
import FormattedInput from '../../components/FormattedInput';
import Tooltip from '../../components/Tooltip';

// Assets
import './styles.scss';

const Fine: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['fine', parameters.id], () =>
        fetchNui('search', {
            type: 'fine',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )

    const id = !isLoading ? data.id : '0';
    const name = !isLoading ? data.name : 'Loading...';
    const code = !isLoading ? data.code : 'Loading...';
    const amount = !isLoading ? data.amount : 0;
    const createdAt = !isLoading ? data.createdAt : null;

    const { values, errors, touched, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { name, code, amount },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('fines.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'fine',
                id: id,
                values: {
                    name: values.name,
                    code: values.code,
                    amount: values.amount
                },
                event: 'fines:update'
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('fines.notification.update.title') as string,
                    message: t('fines.notification.update.message', { id }) as string,
                    autoClose: 5000
                });
    
                return navigate('/fines');
            });
        }
    });

    return (
        <Page header={{
            title: t('fines.fine.title', { id: id }),
            subtitle: t('fines.fine.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='fine'>
                <div className='fine-icon'>
                    <i className='fa-solid fa-receipt'></i>
                    <h1>{name}</h1>
                </div>
                <div className='fine-information'>
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
                                placeholder={t('words.name')}
                                value={values.name}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                className={errors.name && touched.name ? 'input-error' : ''}
                                error={errors.name && touched.name ? errors.name as string : ''}
                            />
            
                            <FormattedInput 
                                id='code'
                                placeholder={t('codes.format', { format: window.CONFIG.CONSTANTS.CODE_FORMAT.LABEL })}
                                value={values.code}
                                onBlur={handleBlur}
                                change={handleChange}
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
                                placeholder={t('words.amount')}
                                value={values.amount}
                                onBlur={handleBlur}
                                change={handleChange}
                                className={errors.amount && touched.amount ? 'input-error' : ''}
                                error={errors.amount && touched.amount ? errors.amount as string : ''}
                                format='number'
                                format_options={{
                                    liveUpdate: true
                                }}
                            />
                        </Form>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default Fine;
