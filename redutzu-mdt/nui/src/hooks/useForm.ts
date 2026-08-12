import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { useMultipleLocalStorage, StorageValues } from '../hooks/useMultipleLocalStorage';
import { useClearLocalStorage } from './useClearLocalStorage';
import { checkPermission } from '../utils/permissions';

// Types
import Permission from '../types/permission';

type FormOptions = {
    initialValues: StorageValues<any>,
    key: string;
    schema?: any;
    enableReinitialize?: boolean;
    permission?: Permission;
    submit?: (values: any) => Promise<boolean>;
    onSuccess?: (response: any) => void;
    onFail?: () => void;
};

export const useForm = (options: FormOptions) => {
    const clearValues = useClearLocalStorage();
    const navigate = useNavigate();

    const [storage, setStorage] = useMultipleLocalStorage(options.initialValues, options.key);

    const { t } = useTranslation('translation');

    const { values, errors, touched, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: storage,
        validationSchema: options.schema,
        enableReinitialize: options.enableReinitialize || false,
        onSubmit: async (values) => {
            if (options.permission) {
                let permission = await checkPermission(options.permission, t);
                if (!permission) return;
            }

            if (options.submit) {
                let response = await options.submit(values);

                if (response) {
                    if (options.onSuccess) {
                        options.onSuccess(response);
                    }
                } else {
                    if (options.onFail) {
                        options.onFail();
                    }
                }

                return clearValues([
                    ...Object.keys(options.initialValues)
                        .map(key => `${options.key}_${key}`)
                ]);
            }
        }
    });

    useEffect(() => {
        setStorage(values);
    }, [values]);

    return {
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        clearValues: () => {
            const keys = Object.keys(options.initialValues)
                        .map(key => `${options.key}_${key}`);

            clearValues(keys);
            navigate(`/${options.key}s`);
        }
    };
};
