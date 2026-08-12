import { MutableRefObject, useState } from 'react';
import { useEventListener } from './useEventListener';

export const useHover = (ref: MutableRefObject<any>) => {
    const [hovered, setHovered] = useState(false);

    useEventListener('mouseover', () => setHovered(true), ref.current);
    useEventListener('mouseout', () => setHovered(false), ref.current);

    return hovered;
};
