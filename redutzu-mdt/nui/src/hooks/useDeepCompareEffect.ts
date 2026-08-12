import { EffectCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash/fp/isEqual';

export const useDeepCompareEffect = (callback: EffectCallback, dependencies: any[]) => {
    const currentRef = useRef<Object>();

    if (!isEqual(currentRef.current, dependencies)) {
        currentRef.current = dependencies;
    }

    useEffect(callback, [currentRef.current]);
};
