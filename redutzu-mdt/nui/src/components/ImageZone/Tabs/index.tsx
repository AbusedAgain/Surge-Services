import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

// Types
interface Props {
    current: string;
    tabs: string[];
    setTab: (tab: string) => void;
}

const Tabs: React.FC<Props> = ({ current, tabs, setTab }) => {
    const { t } = useTranslation('translation');

    const onClick = useCallback((item: string) => {
        if (item === current) return;
        return setTab(item);
    }, [current]);

    return (
        <div className='tab-list'>
            {
                tabs.map((item, index) => (
                    <div 
                        className={`tab ${item == current ? 'active' : ''}`}
                        onClick={() => onClick(item)}
                        key={index}
                    >
                        <Trans t={t}>warrants.tabs.{item.toLowerCase()}</Trans>
                    </div>
                ))
            }
        </div>
    );
}
  
export default Tabs;
  