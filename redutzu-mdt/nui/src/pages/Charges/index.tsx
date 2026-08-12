import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

import Page from '../../components/Page';
import List from '../../components/List';
import Form from './Form';

const Charges: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('charges.title'), subtitle: t('charges.subtitle') }}>
           <div className='half-grid'>
                <List
                    table='charges'
                    icon='fa-solid fa-handcuffs'
                    label={t('charges.form')}
                    name_template='{name}'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/charge/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('charges.modal.delete.title'),
                        description: t('charges.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('charges.delete', t);
                            if (!permission) return;
                
                            let request = fetchNui('delete', {
                                type: 'charges',
                                id: item.id,
                                event: 'charges:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('charges.notification.delete.title') as string,
                                    message: t('charges.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/charges');
                            });
                        }
                    }}
                />
                
                <Form />
            </div>
        </Page>
    );
}

export default Charges;
