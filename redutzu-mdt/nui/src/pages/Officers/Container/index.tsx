import React from 'react';
import Officer from '../Officer';

interface Props {
    label: string;
    items: any[];
}

const Container: React.FC<Props> = ({ label, items }) => {
    return items.length ? (
        <div className='officers-content'>
            <div className='officers-header'>
                <h1>{label}</h1>
            </div>
            <div className='officers-list'>
                {items.map((item: any, index: number) => (
                    <Officer data={item} key={index} />    
                ))}
            </div>
        </div>
    ) : null;
}

export default Container;
