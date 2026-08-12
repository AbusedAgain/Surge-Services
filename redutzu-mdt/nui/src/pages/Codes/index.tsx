import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

import Page from '../../components/Page';
import List from '../../components/List';
import Form from './Form';

const Codes: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('codes.title'), subtitle: t('codes.subtitle') }}>
            <div className='half-grid'>
                <List
                    table='codes'
                    icon='fa-solid fa-clipboard-list'
                    label={t('codes.form')}
                    name_template='{name}'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/code/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('codes.modal.delete.title'),
                        description: t('codes.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('codes.delete', t);
                            if (!permission) return;
                
                            let request = fetchNui('delete', {
                                type: 'codes',
                                id: item.id,
                                event: 'codes:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('codes.notification.delete.title') as string,
                                    message: t('codes.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/codes');
                            });
                        }
                    }}
                />
                
                <Form />
            </div>
        </Page>
    );
}

export default Codes;
