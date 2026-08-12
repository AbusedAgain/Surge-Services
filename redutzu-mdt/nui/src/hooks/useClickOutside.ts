import { MutableRefObject, useEffect } from 'react';

export const useClickOutside = (ref: MutableRefObject<any>, callback: Function) => {
    useEffect(() => {
        let startedInside = false;
        let startedWhenMounted = false;

        const listener = (event: Event) => {
            if (startedInside || !startedWhenMounted) return;
            if (!ref.current || ref.current.contains(event.target)) return;

            return callback(event);
        };

        const start = (event: Event) => {
            startedWhenMounted = ref.current;
            startedInside = ref.current && ref.current.contains(event.target);
        };

        document.addEventListener('mousedown', start);
        document.addEventListener('touchstart', start);
        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('mousedown', start);
            document.removeEventListener('touchstart', start);
            document.removeEventListener('click', listener);
        };
    }, [ref, callback]);
};
