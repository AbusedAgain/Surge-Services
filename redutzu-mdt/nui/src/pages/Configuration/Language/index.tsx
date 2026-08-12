import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import i18n from '../../../locales';

// Components
import Select from '../../../components/Select';

const Language: React.FC = () => {
    const { t } = useTranslation('translation');

    const [language, setLanguage] = useLocalStorage('language', window.CONFIG.DEFAULT_LOCALE);
    const selected = window.CONFIG.LANGUAGES.find((option: any) => option.value === language);

    const changeLanguage = useCallback((value: string) => {
        i18n.changeLanguage(value, (error) => {
            if (!error) return setLanguage(value);
        });
    }, []);
    
    const optionComponent = useCallback((option: any) => {
        const country: string = option.value.slice(3).toUpperCase();
        const url: string = `${window.CONFIG.CONSTANTS.FLAGS_API}/${country}.png`;

        return <>
            <img src={url} style={{ width: '2.5%' }} />
            <h1>{option.label}</h1>
        </>
    }, []);

    return (
        <Select
            id='language'
            placeholder={t('configuration.placeholder')}
            options={window.CONFIG.LANGUAGES}
            selected={selected}
            optionComponent={optionComponent}
            onSelect={option => changeLanguage(option.target.value)}
            maxHeight={300}
        />
    );
}

export default Language;
