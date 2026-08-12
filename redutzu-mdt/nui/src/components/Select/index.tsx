import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import './styles.scss';

interface Option {
    label: string;
    value: any;
}

interface Props {
    id: string;
    options: Option[];
    placeholder: string;
    error?: string;
    className?: string;
    maxHeight?: number;
    selected?: Option;
    optionComponent?: (option: Option) => React.ReactElement;
    onSelect: (value: any) => void;
    onBlur?: (...args: any[]) => any;
}

const Select: React.FC<Props> = settings => {
    const { t } = useTranslation('translation');

    const [selected, setSelected] = useState<Option | null>(settings.selected || null);
    const [opened, setOpened] = useState<boolean>(false);

    useEffect(() => {
        settings.onSelect({
            target: {
                id: settings.id,
                value: selected?.value
            }
        });

        return setOpened(false);
    }, [selected]);

    return (
        <div className='select-form'>
            {
                settings.error && <p className='error-message'>
                    <Trans t={t}>{settings.error}</Trans>
                </p>
            }

            <div className={`select ${settings.className}`} onClick={() => setOpened(!opened)}>
                {
                    selected ? (
                        <p>{selected.label}</p>
                    ) : (
                        <span>{settings.placeholder}</span>
                    )
                }
            </div>

            { 
                opened ? (
                    <div className='results' style={settings.maxHeight ? { maxHeight: settings.maxHeight } : {}}>
                        {
                            settings.options.map((option: Option, index: number) => (
                                <div className='result' key={index} onClick={() => setSelected(option)}>
                                    <div className='text'>
                                        {
                                            settings.optionComponent ? (
                                                settings.optionComponent(option)
                                            ) : (
                                                <h1>{option.label}</h1>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ) : null
            }
        </div>
    );
}
  
export default Select;
  