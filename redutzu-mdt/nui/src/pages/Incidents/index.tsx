import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

import Page from '../../components/Page';
import List from '../../components/List';
import Form from './Form';

const Incidents: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('incidents.title'), subtitle: t('incidents.subtitle') }}>
            <div className='half-grid'>
                <List
                    table='incidents'
                    icon='fa-solid fa-folder'
                    label={t('incidents.form')}
                    name_template='{name}'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/incident/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('incidents.modal.delete.title'),
                        description: t('incidents.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('incidents.delete', t);
                            if (!permission) return;
                
                            let request = fetchNui('delete', {
                                type: 'incidents',
                                id: item.id,
                                event: 'incidents:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('incidents.notification.delete.title') as string,
                                    message: t('incidents.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/incidents');
                            });
                        }
                    }}
                />
                
                <Form />
            </div>
        </Page>
    );
}

export default Incidents;
