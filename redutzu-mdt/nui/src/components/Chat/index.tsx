import React, { useState, useLayoutEffect, useRef } from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react';
import { useEvent } from '../../hooks/useEvent';
import { fetchNui } from '../../utils/misc';

// Components
import Message from './Message';

// Assets
import './styles.scss';

interface Props {
    identifier?: string | null;
}

const Chat: React.FC<Props> = ({ identifier }) => {
    const { t } = useTranslation('translation');
    const ref = useRef<HTMLDivElement>(null);

    const [content, setContent] = useState<string>('');
    const [show, setShow] = useState(false);

    const queryCache = useQueryClient();
    const { data, refetch } = useQuery('chat-messages', () =>
        fetchNui('GetChatMessages')
            .then(data => data)
    )

    const { mutate } = useMutation({
        mutationFn: () =>
            fetchNui('SendChatMessage', {
                content: content,
                timestamp: Date.now()
            }),
        onSuccess: () => queryCache.invalidateQueries('chat-messages')
    });

    useEvent('SetChatMessages', refetch);

    useLayoutEffect(() => {
        if (!ref.current) return;
        ref.current.scrollTop = ref.current.scrollHeight;
    }, [data]);

    const sendMessage = () => {
        if (content.trim().length <= 0) return;
        setShow(false);
        setContent('');
        mutate();
    };

    return (
        <div className='chat'>
            <div className='header'>
                <h1>Chat</h1>
            </div>
            <div className='body'>
                <div className='messages' ref={ref}>
                    { (data || []).map((message: any, index: number) => 
                        <Message 
                            {...message}
                            self={identifier === message.identifier}
                            key={index}
                        />
                    )}
                </div>
                <div className='footer'>
                    <input type='text' 
                        value={content}
                        placeholder={t('chat.placeholder')}
                        onChange={event => setContent(event.target.value)}
                        onKeyDown={event => {
                            if (event.key.toLowerCase() !== 'enter') return;
                            return sendMessage();
                        }}
                    />

                    <div className='emojis'>
                        <i className='fa-regular fa-face-laugh-beam' onClick={() => setShow(!show)}></i>
                        <i className='fa-regular fa-paper-plane' onClick={sendMessage}></i>
                    </div>
                     
                    {
                        show && <EmojiPicker
                            onEmojiClick={emoji => {
                                setShow(false);
                                setContent(content => content + emoji.emoji);
                            }}
                            emojiStyle={EmojiStyle.TWITTER}
                            previewConfig={{ showPreview: false }}
                        />
                    }
                </div>
            </div>
        </div>
    )
}
  
export default Chat;
  