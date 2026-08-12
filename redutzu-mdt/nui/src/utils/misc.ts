export const isBrowser: boolean = !(window as any).invokeNative;
export const resource: string = isBrowser ? 'redutzu-mdt' : (window as any).GetParentResourceName();

export const fetchNui = async (eventName: string, data?: any, mock?: any): Promise<any> => {
    if (isBrowser && mock) return mock;

    try {
        const response = await fetch(`https://${resource}/${eventName}`, {
            method: 'POST',
            referrerPolicy: 'no-referrer',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    } catch(error) {
        return;
    }
};

export const formatDate = (date: string) => new Date(parseInt(date)).toLocaleString(window.CONFIG.DEFAULT_LOCALE);
export const formatNumber = (value: number) => new Intl.NumberFormat(window.CONFIG.DEFAULT_LOCALE).format(value);
export const isObject = (object: any) => object != null && typeof object === 'object';

export const template = (template: string, data: any) => {
    let keys = Object.keys(data);
    
    keys.forEach(key => {
        let value = data[key];
        let string = new RegExp(`{${key}}`, 'g');
        let digits = new RegExp(`=${key}=`, 'g');
        let date = new RegExp(`~${key}~`, 'g');

        if (isObject(value)) {
            let replacement = template.split('-').slice(1);
            let array = replacement.map(w => w.slice(0, w.indexOf('}')))
            
            array.forEach(w => {
                string = new RegExp(`{${key}-${w}}`, 'g');
                template = template.replace(string, value[w]);
            });
        }

        template = template.replace(string, value)
            .replace(digits, formatNumber(value))
            .replace(date, formatDate(value));
    });
    
    return template;
}

export const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);