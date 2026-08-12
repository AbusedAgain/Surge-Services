import React, { useState, useEffect, useRef } from 'react';
import { RgbColor, RgbColorPicker } from 'react-colorful';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

import Colors from '../../../types/colors';

interface Props {
    name: string;
    label: string;
}

const element = document.documentElement.style;

const Color: React.FC<Props> = ({ name, label }) => {
    const popover = useRef(null);

    const [storage, setStorage] = useLocalStorage(name, window.CONFIG.COLORS[name as Colors]);
    const [preview, setPreview] = useState<boolean>(false);  
    const [rgb, setRGB] = useState<RgbColor>({ r: 0, g: 0, b: 0 });  
    const [color, setColor] = useState<string>(storage);

    useClickOutside(popover, () => setPreview(false));

    useEffect(() => {
        const [r, g, b] = storage.split(', ');
        setRGB({ r: parseInt(r), g: parseInt(g), b: parseInt(b) });
    }, []);
    
    useEffect(() => {
        const { r, g, b } = rgb;
        setColor(`${r}, ${g}, ${b}`);
    }, [rgb]);

    useEffect(() => {
        setStorage(color);
        element.setProperty(`--${name}`, color);
    }, [color]);

    return (
        <div className='color-container'>
            <div className='color-label'>{label}</div>
            <div 
                className='color-circle'
                style={{ backgroundColor: `rgba(var(--${name}), 1)` }}
                onClick={() => setPreview(!preview)}
            />
            { 
                preview ? (   
                    <div className='popover' ref={popover}>
                        <RgbColorPicker color={rgb} onChange={setRGB} />
                    </div> 
                ) : null
            }
        </div>
    );
}

export default Color;
