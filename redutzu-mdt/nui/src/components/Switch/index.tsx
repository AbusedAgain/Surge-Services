import React, { useCallback } from 'react';
import ReactSwitch from 'react-switch';

import './styles.scss';

interface Props {
    id: string;
    checked?: boolean;
    onChange: (...args: any[]) => any;
}

const Switch: React.FC<Props> = ({ id, checked = false, onChange }) => {
    const handleChange = useCallback((value: boolean) => {
        onChange({
            target: {
                id: id,
                value: value
            }
        })
    }, [checked]);

    return (
        <ReactSwitch className={`switch ${checked ? 'checked' : ''}`} checked={checked} onChange={handleChange} />
    );
}
  
export default Switch;
  