import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { fetchNui } from '../../../utils/misc';

// Components
import Input from '../../../components/Input';
import Item from './Item';

// Assets
import Announcement from '../../../types/announcement';

import './styles.scss';

const AnnouncementList: React.FC = () => {
    const [query, setQuery] = useState('');
    const { t } = useTranslation('translation');

    const { data } = useQuery(['announcements', query], () =>
        fetchNui('search', {
            type: 'announcements',
            query: `%${query}%`,
            limit: window.CONFIG.SETTINGS.MAX_RESULTS
        })
        .then((data: Announcement[]) => {
            data.sort(result => result.pinned ? -1 : 1);
            return data;
        })
    )

    return (
        <div className='announcements'>
            <Input
                icon='fa-solid fa-magnifying-glass'
                placeholder={t('announcements.search')}
                onChange={e => setQuery(e.target.value)}
            />
            <div className='announcements-list'>
                {
                    (data || []).map((announcement: Announcement, index: number) => (
                        <Item key={index} {...announcement} />
                    ))
                }
            </div>
        </div>
    );
}

export default AnnouncementList;
