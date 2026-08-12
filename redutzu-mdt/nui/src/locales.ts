import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const resources = resourcesToBackend((language, namespace, callback) => {
    const promise = import(`../../config/locales/${language}/${namespace}.json`);

    promise.then((data) => callback(null, data))
        .catch(error => callback(error, null));
});

i18n.use(initReactI18next)
    .use(resources)
    .init({
        returnNull: false,
        lng: window.CONFIG.DEFAULT_LOCALE,
        fallbackLng: window.CONFIG.DEFAULT_LOCALE,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;