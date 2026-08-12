import React, { useId } from 'react';
import ReactTooltip from 'react-tooltip';
import './styles.scss';

type Position = 'top' | 'right' | 'bottom' | 'left';

interface Props {
    text: string;
    children: React.ReactNode;
    position?: Position;
}

const Tooltip: React.FC<Props> = ({ text, children, position = 'top' }) => {
    const id = useId();

    return <>
        <div data-tip data-for={id} className='tooltip'>
            {children}
        </div>
        <ReactTooltip id={id} effect='solid' place={position}>
            {text}
        </ReactTooltip>
    </>;
};
  
export default Tooltip;
  