import React from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { fetchNui } from '../../utils/misc';

// Components
import Page from '../../components/Page';
import Chat from '../../components/Chat';
import SimpleList from '../../components/SimpleList';
import Box from './Box';

// Assets
import './styles.scss';

const Dashboard: React.FC = () => {
    const { t } = useTranslation('translation');

    const { isLoading, data } = useQuery('dashboard', () =>
        fetchNui('GetDashboardData')
            .then(data => data)
    )

    const officers = !isLoading ? data.officers : [];
    const name = !isLoading ? `${data.name.firstname} ${data.name.lastname}` : 'Loading...';
    const job = !isLoading ? data.job : { grade: 'Loading...', label: 'Loading...' };
    const identifier = !isLoading ? data.identifier : 'Loading...';
    const alerts = !isLoading ? data.alerts : [];
    const citizens = !isLoading ? data.citizens : [];
    const vehicles = !isLoading ? data.vehicles : [];

    return (
        <Page header={{ 
            title: t('dashboard.title', { name }),
            subtitle: t('dashboard.subtitle', { label: job.label, grade: job.grade })
        }}>
            <div className='dashboard-container'>
                <div className='dashboard-header'>
                    <Box icon='fa-solid fa-tower-broadcast' title={t('dashboard.alerts')} value={alerts} />
                    <Box icon='fa-solid fa-users' title={t('dashboard.citizens')} value={citizens} />
                    <Box icon='fa-solid fa-car' title={t('dashboard.vehicles')} value={vehicles} />
                </div>
                <div className='dashboard-footer'>
                    <Chat identifier={identifier} />
                    <SimpleList
                        label={t('dashboard.officers')}
                        results={officers}
                        icon='fa-solid fa-user'
                        main_template='{name}'
                        secondary_template='{grade}'
                        redirect='/citizen/{identifier}'
                    />
                </div>
            </div>
        </Page>
    );
}

export default Dashboard;
