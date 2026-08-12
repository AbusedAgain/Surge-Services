import { useEffect, useRef } from 'react';

export const useIsMount = () => {
    const reference = useRef(true);
    
    useEffect(() => {
        reference.current = false;
    }, []);

    return reference.current;
}
