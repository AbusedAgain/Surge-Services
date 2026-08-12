import React, { useState, useEffect, InputHTMLAttributes, useCallback } from 'react';
import { useFormattedInput, currencyFormatter, intlNumberFormatter, percentFormatter, numberFormatter, creditCardFormatter, maskFormatter } from 'react-formatted-input-hook'
import { Trans, useTranslation } from 'react-i18next';

import '../Input/styles.scss';

type Format = 'number' | 'formattedNumber' | 'percent' | 'currency' | 'creditCard' | 'mask';

interface Props {
    icon?: string;
    error?: string;
    format?: Format;
    format_options?: any;
    change: (value: any) => void;
}

const formatters = {
    number: numberFormatter,
    formattedNumber: intlNumberFormatter,
    percent: percentFormatter,
    currency: currencyFormatter,
    creditCard: creditCardFormatter,
    mask: maskFormatter
}

const FormattedInput: React.FC<Props & InputHTMLAttributes<HTMLInputElement>> = settings => {
    const { t } = useTranslation('translation');
    
    const [value, setValue] = useState<number | string | null>(null);
    const [format, setFormat] = useState<any>();

    const onChange = useCallback((text: string, same: string) => {
        let value: string | number = parseInt(text);

        if (settings.format_options.same) {
            value = same;
        }

        settings.change({
            target: {
                id: settings.id || 'input',
                value: value
            }
        });

        return setValue(value);
    }, [value]);

    useEffect(() => {
        if (settings.format) {
            let format = formatters[settings.format]({ ...settings.format_options, onChange });
            setFormat(format);
        }
    }, []);

    let input = useFormattedInput(format);
    
    return (
        <div className='input-form'>
            {settings.error && <p className='error-message'>
                <Trans t={t}>{settings.error}</Trans>
            </p>}
            <input
                {...input.props}
                {...settings}
            />
        </div>
    );
}

export default FormattedInput;
