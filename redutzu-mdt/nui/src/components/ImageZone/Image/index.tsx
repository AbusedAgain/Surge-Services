import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../../hooks/useClickOutside';

// Assets
import './styles.scss';

// Types
interface Props {
    source: string;
    onContextMenu: () => void;
}

const Image: React.FC<Props> = ({ source, onContextMenu }) => {
    const ref = useRef(null);
    const [preview, setPreview] = useState(false);
    
    useClickOutside(ref, (event: MouseEvent) => {
        event.preventDefault();

        if (!preview) return;
        setPreview(false);
    });

    return (
        <div 
            className={`image-container ${preview ? 'preview' : ''}`}
            ref={ref}
            onClick={() => setPreview(!preview)}
            onContextMenu={event => {
                event.preventDefault();
                return onContextMenu();
            }}
        >
            <img 
                src={source} 
                referrerPolicy='no-referrer'
            />
        </div>
    );
}
  
export default Image;
  