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
import schema from '../../schemas/codes';

// Components
import Page from '../../components/Page';
import Form from '../../components/Form';
import Input from '../../components/Input';
import FormattedInput from '../../components/FormattedInput';
import Tooltip from '../../components/Tooltip';

import './styles.scss';

const Code: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['code', parameters.id], () =>
        fetchNui('search', {
            type: 'code',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )
    
    const id = !isLoading ? data.id : '0';
    const name = !isLoading ? data.name : 'Loading...';
    const code = !isLoading ? data.code : 'Loading...';
    const createdAt = !isLoading ? data.createdAt : null;

    const { values, errors, touched, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { name, code },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('codes.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'code',
                id: id,
                values: {
                    name: values.name,
                    code: values.code
                },
                event: 'codes:update'
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('codes.notification.update.title') as string,
                    message: t('codes.notification.update.message', { id: id }) as string,
                    autoClose: 5000
                });
    
                return navigate('/codes');
            });
        }
    });

    return (
        <Page header={{
            title: t('codes.code.title', { code }),
            subtitle: t('codes.code.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='code'>
                <div className='code-icon'>
                    <i className='fa-solid fa-clipboard-list'></i>
                    <h1>{name}</h1>
                </div>
                <div className='code-information'>
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
                        </Form>
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default Code;
