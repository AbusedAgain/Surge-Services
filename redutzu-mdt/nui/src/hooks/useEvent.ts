import { MutableRefObject, useEffect, useRef } from 'react';
import { isBrowser } from '../utils/misc';

export const useEvent = (name: string, callback: (...args: any[]) => void, mock: any = null) => {
    const handler: MutableRefObject<any> = useRef(() => {});

    useEffect(() => {
        handler.current = callback;
    }, [callback]);

    useEffect(() => {
        if (mock && isBrowser) {
            handler.current(mock);
            return;
        }

        const listener = (event: MessageEvent) => {
            const { action, data } = event.data;

            if (!handler.current) return;
            if (action !== name) return;
            
            handler.current(data);
        }

        window.addEventListener('message', listener); 

        return () => window.removeEventListener('message', listener);
    }, [name]);
};
