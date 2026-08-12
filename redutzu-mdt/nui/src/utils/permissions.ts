import { fetchNui, isBrowser } from './misc';
import { showNotification } from '@mantine/notifications';

// Assets
import Permission from '../types/permission';

export const hasPermission = async (permission: Permission) => {
    if (isBrowser) return true;

    const permissions = await fetchNui('GetPermissions');
    return permissions.includes(permission);
};

export const checkPermission = async (permission: Permission, t: (...args: any[]) => any) => {
    const status = await hasPermission(permission);
    
    if (!status) {
        showNotification({
            title: t('words.error'),
            message: t('errors.no-permission'),
            id: 'error',
            autoClose: 5000
        });
    }

    return status;
};
