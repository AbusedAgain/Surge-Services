import { useEffect, useRef } from 'react';

export const useEventListener = (type: string, callback: Function, element: any = window) => {
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (element == null) return;
        const handler = (event: Event) => callbackRef.current(event);
        element.addEventListener(type, handler);
        return () => element.removeEventListener(type, handler);
    }, [type, element]);
};
