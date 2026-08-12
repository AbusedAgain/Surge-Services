import { useState, useCallback } from 'react';

export const useStateWithValidation = (validation: Function, initial: any) => {
    const [state, setState] = useState(initial);
    const [isValid, setIsValid] = useState(() => validation(state));

    const onChange = useCallback((next: any) => {
        const value = typeof next === 'function' ? next(state) : next;
        setState(value);
        setIsValid(validation(value));
    }, [validation]);

    return [state, onChange, isValid];
};
