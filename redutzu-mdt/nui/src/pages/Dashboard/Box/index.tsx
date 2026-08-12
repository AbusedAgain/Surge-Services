import React from 'react';
import { formatNumber } from '../../../utils/misc';

// Assets
import './styles.scss';

interface Props {
    icon: string;
    value: number;
    title: string;
}

const Box: React.FC<Props> = ({ icon, title, value }) => {
    return (
        <div className='header-box'>
            <div className='icon'>
                <i className={icon}></i>
            </div>
            <div className='information'>
                <div className='value'>
                    <h1>{formatNumber(value)}</h1>
                </div>
                <div className='title'>
                    <p>{title}</p>
                </div>
            </div>
        </div>
    );
}

export default Box;
