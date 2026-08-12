import React, { useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../../../utils/misc';
import { fromNow } from '../../../../utils/date';
import { checkPermission } from '../../../../utils/permissions';

// Contexts
import Modals from '../../../../contexts/Modal';

// Components
import Tooltip from '../../../../components/Tooltip';

// Assets
import Props from '../../../../types/announcement';

import './styles.scss';

const AnnouncementItem: React.FC<Props> = ({ id, title, content, author, createdAt, pinned }) => {
    const { createModal } = useContext(Modals);
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    const user = JSON.parse(author);
    const message = content.replace(/<\/?[^>]+(>|$)/g, '');
    const date = new Date(createdAt).valueOf();

    const handleClick = () => navigate(`/announcement/${id}`);

    const handleDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
            
        return createModal({
            title: t('announcements.modal.delete.title'),
            description: t('announcements.modal.delete.message'),
            icon: 'fa-solid fa-trash-can',
            onClick: async () => {
                let permission = await checkPermission('announcements.delete', t);
                if (!permission) return;
    
                let request = fetchNui('delete', {
                    type: 'announcements',
                    id: id,
                    event: 'announcements:delete'
                });

                return request.then(() => {
                    showNotification({
                        title: t('announcements.notification.delete.title') as string,
                        message: t('announcements.notification.delete.message', { id }) as string,
                        autoClose: 5000
                    });

                    return navigate('/announcements');
                });
            }
        })  
    };
    
    return (
        <div 
            className='announcement'
            onClick={handleClick}
            onContextMenu={handleDelete}
        >
            <h1>
                { 
                    pinned && (
                        <Tooltip text={t('announcements.pinned')}>
                            <i className='fa-solid fa-thumbtack'></i>
                        </Tooltip>
                    )
                } {title}
            </h1>
            <h2><span>{user.name}</span>: {message}</h2>
            <p><Trans t={t}>announcements.created</Trans> {fromNow(date)}</p>
        </div>
    );
}

export default AnnouncementItem;
