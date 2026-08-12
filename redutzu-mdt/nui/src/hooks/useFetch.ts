import { useAsync } from './useAsync';

export const useFetch = (url: string, options: Object = {}, dependencies: any[] = []) => {
    return useAsync(() => {
        return fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            ...options
        }).then(res => {
            if (res.ok) return res.json();
            return res.json().then(json => Promise.reject(json));
        });
    }, dependencies);
};
