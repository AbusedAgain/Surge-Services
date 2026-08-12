import { useCallback } from 'react';

export const useClearLocalStorage = () => {
    const clearLocalStorage = useCallback((keys: string | string[]) => {
        if (Array.isArray(keys)) {
            keys.forEach((key) => {
                localStorage.removeItem(key);
            });
        } else {
            localStorage.removeItem(keys);
        }
    }, []);

    return clearLocalStorage;
};
