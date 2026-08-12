import React, { useCallback } from 'react';

// Components
import Image from '../Image';

// Types
interface Props {
    images: string[];
    setImages: (...args: any[]) => void;
}

const Images: React.FC<Props> = ({ images, setImages }) => {
    const onContextMenu = useCallback((index: number) => {
        let value: string[] = images.filter((item, i) => i !== index);
        setImages(value);
    }, [images]);

    return images.length ? (
        <div className='images'>
            {
                images.map((image, index) => (
                    <Image 
                        key={index}
                        source={image}
                        onContextMenu={() => onContextMenu(index)}
                    />
                ))
            }
        </div>
    ) : null;
}
  
export default Images;
  