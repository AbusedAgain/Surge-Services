import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Page from '../../components/Page';
import List from '../../components/List';

const Houses: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('houses.title'), subtitle: t('houses.subtitle') }}>
            <div className='full-list-container'>
                <List
                    table='properties'
                    icon='fa-solid fa-house'
                    label={t('houses.form')}
                    name_template='{label}'
                    onClick={item => navigate(`/house/${item.id}`)}
                />
            </div>
        </Page>
    );
}

export default Houses;
