import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Page from '../../components/Page';
import List from '../../components/List';

const Citizens: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('citizens.title'), subtitle: t('citizens.subtitle') }}>
            <div className='full-list-container'>
                <List
                    table='players'
                    icon='fa-solid fa-user'
                    label={t('citizens.form')}
                    name_template='{firstname} {lastname}'
                    info_template='{phone_number}'
                    onClick={item => navigate(`/citizen/${item.identifier}`)}
                />
            </div>
        </Page>
    );
}

export default Citizens;
