import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TypographyStylesProvider } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { fromNow } from '../../utils/date';
import { checkPermission } from '../../utils/permissions';

// Components
import Page from '../../components/Page';
import Switch from '../../components/Switch';
import Button from '../../components/Button';
import TextEditor from '../../components/TextEditor';

// Form
import { useFormik } from 'formik';
import schema from '../../schemas/announcement';

// Assets
import './styles.scss';

const Announcement: React.FC = () => {
    const { t } = useTranslation('translation');

    const parameters = useParams();
    const queryCache = useQueryClient();
    const navigate = useNavigate();

    const { isLoading, data } = useQuery('announcement', () =>
        fetchNui('search', {
            type: 'announcement',
            query: parameters.id,
            single: true
        })
        .then(data => data)
    )

    const id = !isLoading ? data.id : '0';
    const content = !isLoading ? data.content : '<p>Loading...</p>';
    const author = !isLoading ? JSON.parse(data.author) : { name: 'Loading...', identifier: null };
    const pinned = !isLoading ? data.pinned : 0;
    const createdAt = !isLoading ? data.createdAt : null;

    // Pin announcement

    const { mutate } = useMutation({
        mutationFn: async (value: boolean) => {
            let permission = await checkPermission('announcements.edit', t);
            if (!permission) return;

            let pinned = value ? 1 : 0;

            return fetchNui('update', {
                type: 'announcement',
                id: id,
                values: { pinned },
                event: 'announcements:update'
            }).then(data => data);
        },
        onSuccess: () => queryCache.invalidateQueries('announcement')
    });

    // Edit announcement
    const [edit, setEdit] = useState(false);

    const { values, handleChange, submitForm } = useFormik({
        initialValues: {
            content: content
        },
        validationSchema: schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            let response = await fetchNui('update', {
                type: 'announcement',
                id: id,
                values: {
                    content: values.content
                },
                event: 'announcements:update'
            });

            if (!response.status) return;
            
            showNotification({
                title: t('announcements.notification.update.title') as string,
                message: t('announcements.notification.update.message', { id }) as string,
                autoClose: 5000
            });

            return setEdit(false);
        }
    });

    const editAnnouncement = async () => {
        let permission = await checkPermission('announcements.edit', t);
        if (!permission) return;

        if (edit) {
            return submitForm();
        } else {
            return setEdit(true);
        }
    };
    
    return (
        <Page header={{
            title: t('announcements.announcement.title', { id }),
            subtitle: t('announcements.announcement.subtitle', { date: fromNow(createdAt) }),
            backable: true
        }}>
            <div className='announcement-content'>
                <div className='announcement-information'>
                    <div className='data'>
                        <p>
                            Author: <b>
                                {author.name}&nbsp;
                                <i className='fa-solid fa-diamond-turn-right' onClick={() => navigate(`/citizen/${author.identifier}`)}></i>
                            </b>
                        </p>
                        <p>
                            Pinned: 
                            <Switch id='pinned' checked={pinned} onChange={event => mutate(event.target.value)} />
                        </p>    
                    </div>
                    <div className='settings'>
                        <Button 
                            label={t(`announcements.announcement.${edit ? 'save' : 'edit'}`)}
                            onClick={editAnnouncement}
                        />
                    </div>
                </div>

                { 
                    edit ? (
                        <TextEditor
                            id='content'
                            value={values.content}
                            onChange={handleChange}
                        />
                    ) : (
                        <TypographyStylesProvider>
                            <div dangerouslySetInnerHTML={{ __html: values.content }} />
                        </TypographyStylesProvider>
                    )
                }
            </div>
        </Page>
    );
}

export default Announcement;
