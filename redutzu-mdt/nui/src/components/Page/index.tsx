import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

interface Header {
    title: string;
    subtitle: string;
    backable?: boolean;
}

interface Props {
    header?: Header;
    children: React.ReactNode;
}

const Page: React.FC<Props> = ({ header, children }) => {
    let navigate = useNavigate();

    return <>
        {header && (<div className='page-header'>
            <h1>
                {header.backable && (
                    <i className='fa-solid fa-arrow-circle-left' onClick={() => navigate(-1)}></i> 
                )}
                
                {header.title}
            </h1>
            <p>{header.subtitle}</p>
        </div>)}
        {children}
    </>;
}
  
export default Page;
  