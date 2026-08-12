import { createContext } from 'react';
import Modal from '../types/modal';

const Context = createContext({
    createModal: (modal: Modal) => {}
})

export default Context;