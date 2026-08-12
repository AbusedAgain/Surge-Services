import React from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Page from '../../components/Page';
import Map from '../../components/Map';
import Form from './Form';

import './styles.scss';

const Alerts: React.FC = () => {
    const { t } = useTranslation('translation');

    return (
        <Page header={{ title: t('alerts.title'), subtitle: t('alerts.subtitle') }}>
            <div className='half-grid'>
                <Form />
                <Map />
            </div>
        </Page>
    );
}

export default Alerts;
