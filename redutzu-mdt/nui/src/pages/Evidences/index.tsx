import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

// Components
import Page from '../../components/Page';
import List from '../../components/List';
import Form from './Form';

const Evidences: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('evidences.title'), subtitle: t('evidences.subtitle') }}>
            <div className='half-grid'>
                <List
                    table='evidences'
                    icon='fa-solid fa-folder'
                    label={t('evidences.form')}
                    name_template='{name}'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/evidence/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('evidences.modal.delete.title'),
                        description: t('evidences.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('evidences.delete', t);
                            if (!permission) return;
                
                            let request = fetchNui('delete', {
                                type: 'evidences',
                                id: item.id,
                                event: 'evidences:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('evidences.notification.delete.title') as string,
                                    message: t('evidences.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/evidences');
                            });
                        }
                    }}
                />
                
                <Form />
            </div>
        </Page>
    );
}

export default Evidences;
