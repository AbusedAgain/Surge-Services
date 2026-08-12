import { useState } from 'react';

export const useLocalStorage = (key: string, value?: any) => {
    const [stored, setStored] = useState(() => {
        if (typeof window == 'undefined') return value;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : value;
        } catch (error) {
            return value;
        }
    });

    const setValue = (value: any) => {
        try {
            const valueToStore = value instanceof Function ? value(stored) : value;
            setStored(valueToStore);
            if (typeof window !== 'undefined') {
                return window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    }

    return [stored, setValue];
};
