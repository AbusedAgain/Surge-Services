import React from 'react';
import ModalType from '../../types/modal';
import Modal from './Modal';
import './styles.scss';

interface Props {
    modals: ModalType[];
    setModals: (modals: ModalType[]) => void;
}

const Modals: React.FC<Props> = ({ modals, setModals }) => {
    const closeModal = (index: number) => setModals(modals.filter((modal: ModalType, i) => i !== index));
    
    return (
        <div className={`modals ${modals.length > 0 ? 'active' : ' '}`}>
            {
                modals.map((modal, index) =>
                    <Modal modal={modal} index={index} close={closeModal} key={index} />
                )
            }
        </div>
    )
}

export default Modals;
  