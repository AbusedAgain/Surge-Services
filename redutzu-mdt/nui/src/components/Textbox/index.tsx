import React, { TextareaHTMLAttributes } from 'react';
import { DebounceInput, DebounceInputProps } from 'react-debounce-input';
import { Trans, useTranslation } from 'react-i18next';
import './styles.scss';

interface Props {
    error?: string;
}

const Textbox: React.FC<Props & DebounceInputProps<HTMLTextAreaElement, any> & TextareaHTMLAttributes<HTMLTextAreaElement>> = props => {
    const { t } = useTranslation('translation');

    return (
        <>
            {props.error && <p className='textbox-error-message'>
                <Trans t={t}>{props.error}</Trans>
            </p>}
            <DebounceInput
                element='textarea'
                debounceTimeout={300}
                spellCheck={false}
                {...props}
            />
        </>
    );
}
  
export default Textbox;
  