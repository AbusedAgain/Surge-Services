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

const Fines: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('fines.title'), subtitle: t('fines.subtitle') }}>
            <div className='half-grid'>
                <List
                    table='fines'
                    icon='fa-solid fa-receipt'
                    label={t('fines.form')}
                    name_template='{name} ({code})'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/fine/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('fines.modal.delete.title'),
                        description: t('fines.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('fines.delete', t);
                            if (!permission) return;
                
                            let request = fetchNui('delete', {
                                type: 'fines',
                                id: item.id,
                                event: 'fines:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('fines.notification.delete.title') as string,
                                    message: t('fines.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/fines');
                            });
                        }
                    }}
                />
                
                <Form />
            </div>
        </Page>
    );
}

export default Fines;
