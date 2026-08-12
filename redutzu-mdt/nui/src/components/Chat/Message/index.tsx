import React, { useState, useEffect } from 'react';
import moment from 'moment';

// Assets
import Placeholder from '../../../assets/default-profile.png';

interface Props {
    content: string;
    self: boolean;
    image: string;
    author: string;
    timestamp: number;
}

const Message: React.FC<Props> = message => {
    const [createdAt, setCreatedAt] = useState<string>();

    useEffect(() => {
        let time = moment(message.timestamp, false);
        setCreatedAt(time.fromNow());
    }, []);

    return (
        <div className={`message ${message.self ? 'self' : ''}`}>
            { 
                !message.self && <div className='message-header'>
                    <div className='message-author'>
                        <img
                            src={message.image || Placeholder}
                            alt={message.author}
                            referrerPolicy='no-referrer'
                        />
                        <span>{message.author}</span>
                    </div>
                    <div className='message-timestamp'>
                        <span>{createdAt}</span>
                    </div>
                </div>
            }
            <div className='message-body'>
                <p>{message.content}</p>
            </div>
        </div>
    )
}
  
export default Message;
  