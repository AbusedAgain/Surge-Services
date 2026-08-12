import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Page from '../../components/Page';
import List from '../../components/List';

const Vehicles: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('vehicles.title'), subtitle: t('vehicles.subtitle') }}>
            <div className='full-list-container'>
                <List
                    table='vehicles'
                    icon='fa-solid fa-car'
                    label={t('vehicles.form')}
                    name_template='{plate}'
                    onClick={item => navigate(`/vehicle/${item.plate}`)}
                />
            </div>
        </Page>
    );
}

export default Vehicles;
