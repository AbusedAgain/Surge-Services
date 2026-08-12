import React, { useState, useCallback, useContext } from 'react';
import { useQuery } from 'react-query';
import { Trans, useTranslation } from 'react-i18next';
import { fetchNui, template } from '../../utils/misc';

import Modals from '../../contexts/Modal';
import Input from '../Input';

import './styles.scss';

interface ContextMenu {
    enabled: boolean;
    title: string;
    description: string;
    icon?: string;
    onConfirm: (...args: any[]) => void;
}

interface Props {
    table: string;
    label: string;
    icon?: string;
    name_template: string;
    info_template?: string;
    interatable?: boolean;
    onClick?: (...args: any[]) => void;
    contextMenu?: ContextMenu;
    sort?: {
        column: string;
        type: string;
    };
    remove?: boolean;
}

const List: React.FC<Props> = settings => {
    const { createModal } = useContext(Modals);
    const { t } = useTranslation('translation');

    const [query, setQuery] = useState('');

    const { data } = useQuery(['list-results', query], () =>
        fetchNui('search', {
            type: settings.table,
            query: `%${query}%`,
            limit: window.CONFIG.SETTINGS.MAX_RESULTS,
            sort: settings.sort
        })
        .then(data => data)
    )

    const handleContext = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>, item: any) => {
        if (settings.contextMenu?.enabled) {
            event.preventDefault();
            
            return createModal({
                title: settings.contextMenu.title,
                description: settings.contextMenu.description,
                icon: settings.contextMenu.icon,
                onClick: () => settings.contextMenu?.onConfirm(item)
            })    
        }
    }, [settings.contextMenu]);

    return (
        <div className='list'>
            <div className='header'>
                <h1>{settings.label}</h1>
                <Input 
                    icon='fa-solid fa-magnifying-glass'
                    placeholder={t('words.search')}
                    onChange={e => setQuery(e.target.value)}
                />
            </div>

            { (data || []).length > 0 ? (
                <div className='results'>
                    {
                        (data || []).map((item: any, index: number) => (
                            <div 
                                className='item'
                                key={index}
                                onClick={() => {
                                    if (settings.onClick)
                                        return settings.onClick(item)
                                }}
                                onContextMenu={event => handleContext(event, item)}
                            >
                                <div className='icon'>
                                    <i className={settings.icon}></i>
                                    <h1>{template(settings.name_template, item)}</h1>
                                </div>

                                {
                                    settings.info_template && <p>
                                        {template(settings.info_template, item)}
                                    </p>
                                }
                            </div>
                        ))
                    }
                </div>
            ) : (
                <div className='not-found'>
                    <i className='fa-regular fa-folder-open'></i>
                    <h1><Trans t={t}>list.not_found</Trans></h1>
                </div>
            )}
        </div>
    );
}
  
export default List;
  