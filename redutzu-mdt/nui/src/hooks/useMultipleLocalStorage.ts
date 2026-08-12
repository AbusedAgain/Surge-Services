import { useState, useEffect } from 'react';

export type StorageValues<T> = {
    [K in keyof T]: T[K] extends boolean | number | string | undefined | null
    ? T[K]
    : never;
};

export const useMultipleLocalStorage = <T extends Record<string, any>>(
    initialValues: StorageValues<T>,
    prefix: string
): [StorageValues<T>, (newValues: Partial<StorageValues<T>>) => void] => {
    const [storage, setStorage] = useState<StorageValues<T>>(() => {
        const storedValues = {} as StorageValues<T>;
        for (const key in initialValues) {
            const prefixedKey = `${prefix}_${key}`;
            const value = localStorage.getItem(prefixedKey);
            if (value !== null) {
                storedValues[key] = JSON.parse(value);
            } else {
                storedValues[key] = initialValues[key];
            }
        }
        return storedValues;
    });

    useEffect(() => {
        for (const key in storage) {
            const prefixedKey = `${prefix}_${key}`;
            localStorage.setItem(prefixedKey, JSON.stringify(storage[key]));
        }
    }, [prefix, storage]);

    const updateStorage = (newValues: Partial<StorageValues<T>>) => {
        setStorage((oldValues) => ({ ...oldValues, ...newValues }));
    };

    return [storage, updateStorage];
};
