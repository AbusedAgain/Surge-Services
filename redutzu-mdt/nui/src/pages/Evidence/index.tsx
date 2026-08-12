import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { fromNow } from '../../utils/date';
import { checkPermission } from '../../utils/permissions';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/evidence';

// Components
import Page from '../../components/Page';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/Input';
import SimpleList from '../../components/SimpleList';

// Assets
import './styles.scss';

const Evidence: React.FC = () => {
    const { t } = useTranslation('translation');
    const parameters = useParams();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery(['evidence', parameters.id], () =>
        fetchNui('search', {
            type: 'evidence',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )

    const id = !isLoading ? data.id : '0';
    const name = !isLoading ? data.name : 'Loading...';
    const description = !isLoading ? data.description : 'Loading...';
    const players = !isLoading ? JSON.parse(data.players) : [];
    const images = !isLoading ? JSON.parse(data.images) : [];
    const createdAt = !isLoading ? data.createdAt : null;

    const { values, handleBlur, handleChange, submitForm } = useFormik({
        initialValues: { players, description },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let permission = await checkPermission('evidences.edit', t);
            if (!permission) return;

            let request = fetchNui('update', {
                type: 'evidence',
                id: id,
                values: {
                    players: JSON.stringify(values.players),
                    description: values.description
                },
                event: 'evidences:update'
            });

            request.then(response => {
                if (!response.status) return;
                
                showNotification({
                    title: t('evidences.notification.update.title') as string,
                    message: t('evidences.notification.update.message', { id }) as string,
                    autoClose: 5000
                });
    
                return navigate('/evidences');
            });
        }
    });

    return (
        <Page header={{
            title: t('evidences.evidence.title', { id }),
            subtitle: t('evidences.evidence.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='evidence'>
                <div className='evidence-icon'>
                    <i className='fa-solid fa-folder-open'></i>
                    <h1>{name}</h1>
                </div>
                <div className='evidence-information'>
                    <div className='title'>
                        <Tooltip text={t('common.tooltip.save')} position='right'>
                            <h1><Trans t={t}>words.information</Trans></h1>
                        </Tooltip>
                        <i className='fa-solid fa-floppy-disk' onClick={submitForm}></i>
                    </div>
                    <div className='data'>
                        <p><b><Trans t={t}>words.name</Trans>:</b>{name}</p>
                        <Input
                            id='description'
                            placeholder={t('words.description')}
                            value={values.description}
                            maxLength={300}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </div>
                </div>
                <div className='body'>
                    <div className='list'>
                        <SimpleList
                            id='players'
                            label={t('evidences.players')}
                            results={values.players}
                            icon='fa-solid fa-user'
                            main_template='{firstname} {lastname}'
                            secondary_template='{phone_number}'
                            redirect='/citizen/{identifier}'
                            onChange={handleChange}
                            modifiable
                        />
                    </div>
                    <div className='images-container'>
                        {
                            images.map((image: string, index: number) => (
                                <div className='image' key={index}>
                                    <img 
                                        src={image}
                                        alt='evidence-image'
                                        referrerPolicy='no-referrer'
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Page>
    );
}

export default Evidence;
