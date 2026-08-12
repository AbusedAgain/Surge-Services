import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useClickOutside } from '../../../hooks/useClickOutside';

// Types
import Type from '../../../types/modal';

interface Props {
    modal: Type;
    index: number;
    close: (index: number) => void;
}

const Modal: React.FC<Props> = ({ modal, index, close }) => {
    const ref = useRef(null);
    const { t } = useTranslation('translation');

    useClickOutside(ref, (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        return close(index);
    });

    return (
        <div className='modal' ref={ref}>
            <div className='info'>
                <i className={modal.icon || 'fa-solid fa-clipboard-question'}></i>
                <h1>{modal.title}</h1>
                { modal.description && <p>{modal.description}</p> }
                { modal.content && <modal.content /> }
            </div>
            <div className='buttons'>
                <button className='primary' onClick={() => {
                    modal.onClick(modal, index);
                    return close(index);
                }}>
                    <Trans t={t}>modal.confirm</Trans>
                </button>
                <button className='red' onClick={() => close(index)}>
                    <Trans t={t}>modal.close</Trans>
                </button>
            </div>
        </div>
    );
}

export default Modal;
  