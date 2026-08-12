import React, { useState, useCallback } from 'react';

// Components
import Input from '../../Input';

// Constants
const LINK_EXPRESSION = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

// Types
interface Props {
    setImages: (...args: any[]) => void;
}

const Link: React.FC<Props> = ({ setImages }) => {
    const [url, setURL] = useState('');

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        const regex = new RegExp(LINK_EXPRESSION);
        const value = url.trim();

        if (event.key.toLowerCase() !== 'enter') return;
        if (value.length <= 0 || !value.match(regex)) return;

        setImages((images: string[]) => [...images, value]);
        setURL('');
    }, [url]);

    return (
        <Input
            id='images'
            placeholder='https://i.imgur.com/'
            value={url}
            onChange={e => setURL(e.target.value)}
            onKeyDown={onKeyDown}
        />
    );
}
  
export default Link;
  