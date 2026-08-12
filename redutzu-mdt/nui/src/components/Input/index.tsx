import React, { InputHTMLAttributes } from 'react';
import { DebounceInput, DebounceInputProps } from 'react-debounce-input';
import { Trans, useTranslation } from 'react-i18next';
import './styles.scss';

interface Props {
    icon?: string;
    error?: string;
}

const Input: React.FC<DebounceInputProps<HTMLInputElement, Props> & InputHTMLAttributes<HTMLInputElement>> = settings => {
    const { t } = useTranslation('translation');

    return (
        <div className='input-form'>
            {settings.error && <p className='error-message'>
                <Trans t={t}>{settings.error}</Trans>
            </p>}
            {settings.icon ? <i className={settings.icon}></i> : null}
            <DebounceInput
                className={`${settings.className} ${settings.icon ? 'with-icon' : ''}`}
                debounceTimeout={300}
                tabIndex={-1}
                spellCheck={false}
                {...settings}
            />
        </div>
    );
}
  
export default Input;
  