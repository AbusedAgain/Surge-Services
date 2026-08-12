import React, { FormHTMLAttributes, useContext } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import Tooltip from '../../components/Tooltip';

// Contexts
import Modals from '../../contexts/Modal';

// Assets
import './styles.scss';

interface Props {
    label?: string;
    disable_clear?: boolean;
    clearValues?: () => void;
    children: React.ReactNode;
}

const Form: React.FC<Props & FormHTMLAttributes<HTMLFormElement>> = settings => {
    const { t } = useTranslation('translation');
    const { createModal } = useContext(Modals);
    
    const clearForm = () => {
        return createModal({
            title: t('common.modal.clear_title'),
            description: t('common.modal.clear_message'),
            icon: 'fa-solid fa-eraser',
            onClick: () => {
                if (settings.clearValues) {
                    settings.clearValues();
                    return;
                }
            }
        });
    }

    return (
        <form {...settings}>
            { 
                settings.label ? 
                    <div className='header'>
                        <h1>{settings.label}</h1>
                        { 
                            settings.disable_clear ? null : (
                                <Tooltip text={t('common.tooltip.clear')}>
                                    <i
                                        className='fa-solid fa-eraser'
                                        onClick={clearForm}
                                    />
                                </Tooltip>
                            )
                        }
                    </div>
                : null
            }
            <div className='content'>
                {settings.children}
            </div>
        </form>
    );
}
  
export default Form;
  