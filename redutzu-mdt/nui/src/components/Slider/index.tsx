import React, { useState } from 'react';
import ReactSlider from 'react-slider';
import './styles.scss';

interface Props {
    id?: string;
    label?: string;
    value?: number;
    min?: number;
    max?: number;
    onChange?: (value: any) => void;
}

const Slider: React.FC<Props> = settings => {
    const [value, setValue] = useState(settings.value || 0);

    return (
        <div className='slider-container' id={settings.id}>
            { settings.label && <h1>{settings.label}</h1> }
            <ReactSlider
                min={settings.min || 0}
                max={settings.max || 100}
                value={value}
                onChange={(value) => {
                    if (settings.onChange) 
                        settings.onChange({
                            target: {
                                id: settings.id,
                                value
                            }
                        });

                    return setValue(value);
                }}
                className='custom-slider'
                thumbClassName='custom-slider-thumb'
                trackClassName='custom-slider-track'
                markClassName='custom-slider-mark'
            />
        </div>
    );
}
  
export default Slider;
  