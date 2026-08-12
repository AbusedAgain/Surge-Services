import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchNui } from '../../utils/misc';

// Components
import Link from './Link';

// Assets
import Permission from '../../types/permission';
import Logo from '../../assets/logo.png';
import './styles.scss';

interface Link {
    id: string;
    label: string;
    icon: string;
    disabled: boolean;
}

const Navigation: React.FC<{ links: Link[] }> = ({ links }) => {
    const [pages, setLinks] = useState<any[]>(links);
    const { t } = useTranslation('translation');

    useEffect(() => {
        fetchNui('GetPermissions')
            .then((permissions: Permission[]) => {
                const condition = (page: any) => permissions.includes(`${page.label}.view` as Permission);
                setLinks(values => values.filter(condition));
            });
    }, []);

    return (
        <aside className='navigation'>
            <div className='logo'>
                <img src={Logo} alt='Logo' />
            </div>
            <ul className='links'>
                {
                    pages
                        .filter(link => !link.disabled)
                        .map((link, index) => <Link key={index} {...link} />)
                }
            </ul>
            <ul className='links'>
                <li className='link' onClick={() => fetchNui('hide')}>
                    <div className='icon'>
                        <i className='fas fa-sign-out-alt'></i>
                    </div>
                    <small><Trans t={t}>words.exit</Trans></small>
                </li>
            </ul>
        </aside>
    )
}
  
export default Navigation;
  