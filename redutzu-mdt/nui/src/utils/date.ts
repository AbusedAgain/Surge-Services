import moment from 'moment';
import i18n from '../locales';

export const fromNow = (timestamp: number | null) => {
    if (!timestamp) return;

    let locale = i18n.language.slice(0, 2);
    moment.locale(locale);

    let data = moment(timestamp).format('YYYYMMDDkkmmss');
    let format = moment(data, 'YYYYMMDDkkmmss').fromNow();
    
    return format;
};
