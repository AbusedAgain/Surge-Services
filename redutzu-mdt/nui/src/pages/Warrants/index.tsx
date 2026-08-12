import React from 'react';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

import Page from '../../components/Page';
import List from '../../components/List';
import Form from './Form';

import './styles.scss';

const Warrants: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('warrants.title'), subtitle: t('warrants.subtitle') }}>
           <div className='half-grid'>
                <List
                    table='warrants'
                    icon='fa-solid fa-folder'
                    label={t('warrants.form')}
                    name_template='{reason}'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/warrant/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('warrants.modal.delete.title'),
                        description: t('warrants.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('warrants.delete', t);
                            if (!permission) return;
                
                            let request = fetchNui('delete', {
                                type: 'warrants',
                                id: item.id,
                                event: 'warrants:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('warrants.notification.delete.title') as string,
                                    message: t('warrants.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/warrants');
                            });
                        }
                    }}
                />

                <Form />
           </div>
        </Page>
    );
}

export default Warrants;
