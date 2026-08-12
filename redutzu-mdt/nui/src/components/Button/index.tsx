import React, { ButtonHTMLAttributes } from 'react';
import './styles.scss';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    onClick?: () => void;
}

const Button: React.FC<Props> = props => {
    return (
        <button className='button' {...props} tabIndex={-1}>
            {props.label}
        </button>
    );
}
  
export default Button;
  