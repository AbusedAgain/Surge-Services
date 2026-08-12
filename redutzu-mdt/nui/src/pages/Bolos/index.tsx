import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showNotification } from '@mantine/notifications';
import { fetchNui } from '../../utils/misc';
import { checkPermission } from '../../utils/permissions';

import Page from '../../components/Page';
import List from '../../components/List';
import Form from './Form';

const Bolos: React.FC = () => {
    const { t } = useTranslation('translation');
    const navigate = useNavigate();

    return (
        <Page header={{ title: t('bolos.title'), subtitle: t('bolos.subtitle') }}>
            <div className='half-grid'>
                <List
                    table='bolos'
                    icon='fa-solid fa-person-circle-exclamation'
                    label={t('bolos.form')}
                    name_template='{title}'
                    info_template='(~createdAt~)'
                    onClick={item => navigate(`/bolo/${item.id}`)}
                    sort={{ column: 'createdAt', type: 'DESC' }}
                    contextMenu={{
                        enabled: true,
                        title: t('bolos.modal.delete.title'),
                        description: t('bolos.modal.delete.message'),
                        icon: 'fa-solid fa-trash-can',
                        onConfirm: async item => {
                            let permission = await checkPermission('bolos.delete', t);
                            if (!permission) return;

                            let request = fetchNui('delete', {
                                type: 'bolos',
                                id: item.id,
                                event: 'bolos:delete'
                            });

                            return request.then(() => {
                                showNotification({
                                    title: t('bolos.notification.delete.title') as string,
                                    message: t('bolos.notification.delete.message', { id: item.id }) as string,
                                    autoClose: 5000
                                });

                                return navigate('/bolos');
                            });
                        }
                    }}
                />

                <Form />
            </div>
        </Page>
    );
}

export default Bolos;