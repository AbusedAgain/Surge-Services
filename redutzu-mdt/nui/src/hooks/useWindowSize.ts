import { useState } from 'react';
import { useEventListener } from './useEventListener';

export const useWindowSize = () => {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEventListener('resize', () => {
        return setSize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    });

    return size;
};
