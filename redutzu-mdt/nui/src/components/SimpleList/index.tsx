import React, { useState, useContext, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { template } from '../../utils/misc';

import Modals from '../../contexts/Modal';

import './styles.scss';

interface Props {
    label: string;
    results: any[];
    icon: string;
    id?: string;
    main_template: string;
    secondary_template?: string;
    redirect?: string;
    modifiable?: boolean;
    onRightClick?: (...args: any[]) => void;
    onChange?: (...args: any[]) => void;
}

const SimpleList: React.FC<Props> = ({ label, results, icon, id, main_template, secondary_template, redirect, modifiable, onRightClick, onChange }) => {
    const [modifying, setModifying] = useState<boolean>(false);

    const { createModal } = useContext(Modals);
    const { t } = useTranslation('translation');

    const navigate = useNavigate();

    const handleClick = useCallback((result: any) => {
        if (!redirect) return;
        let url: string = template(redirect, result);
        return navigate(url);
    }, [redirect]);

    const removeResult = useCallback((result: any) => {
        const updated = results.filter(r => r !== result);

        createModal({
            title: t('common.modal.list_remove'),
            description: t('common.modal.list_remove_message'),
            icon: 'fa-solid fa-trash-can',
            onClick: () => {
                if (onChange) {
                    onChange({
                        target: {
                            id: id,
                            value: updated
                        }
                    })
                }

                if (updated.length <= 1) {
                    setModifying(false);
                }
            }
        }) 
    }, [results, modifying]);

    return results.length ? (
        <div className='simple-list'>
            <div className='header'>
                <h1>{label}</h1>
                {
                    (modifiable && results.length > 1) && (
                        modifying 
                            ? <i className='fa-solid fa-right-to-bracket' onClick={() => setModifying(false)} />
                            : <i className='fa-solid fa-pen-to-square' onClick={() => setModifying(true)}/>
                    )
                }
            </div>
            <div className='results'>
                {
                    results.map((result, index) => 
                        <div 
                            className={`result ${modifying ? 'remove' : ''}`} 
                            onClick={() => modifying ? removeResult(result) : handleClick(result)}
                            onContextMenu={() => onRightClick && onRightClick(result)}
                            key={index}
                        >
                            <div className='icon'>
                                <i className={icon} />
                                <h1>
                                    <Trans t={t}>
                                        {template(main_template, result)}
                                    </Trans>
                                </h1>
                            </div>
                            { secondary_template && <p>{template(secondary_template, result)}</p> }
                        </div>
                    )
                }
            </div>
        </div>
    ) : null;
}
  
export default SimpleList;
  