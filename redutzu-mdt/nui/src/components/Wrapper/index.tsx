import React from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './styles.scss';

interface Props {
    children: React.ReactNode;
}

const Wrapper: React.FC<Props> = ({ children }) => {
    let location = useLocation();

    return (      
        <TransitionGroup>
            <CSSTransition key={location.key} classNames='fade' timeout={500}>
                <div className='page'>
                    <Routes>
                        {children}
                    </Routes>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
}
  
export default Wrapper;
  