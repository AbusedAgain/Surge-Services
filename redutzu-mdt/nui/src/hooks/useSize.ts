import { useState, useEffect, MutableRefObject } from 'react';

export const useSize = (ref: MutableRefObject<any>) => {
    const [size, setSize] = useState({});

    useEffect(() => {
        if (ref.current == null) return;

        const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect));
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    return size;
};
