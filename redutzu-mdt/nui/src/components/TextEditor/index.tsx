import React from 'react';
import { RichTextEditor } from '@mantine/rte';

import './styles.scss';

interface Props {
    id: string;
    value?: string;
    onBlur?: (...args: any[]) => any;
    onChange: (value: any) => void;
}

const TextEditor: React.FC<Props> = ({ id, value, onBlur, onChange }) => {
    return (
        <div className='text-editor'>
            <RichTextEditor
                id={id}
                value={value}
                controls={[
                    ['bold', 'italic', 'underline', 'strike', 'clean'],
                    ['h1', 'h2', 'h3', 'h4'],
                    ['sub', 'sup'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                    ['unorderedList', 'orderedList'],
                    ['video', 'blockquote', 'codeBlock']
                ]}
                onBlur={onBlur}
                onChange={(value) => {
                    onChange({
                        target: {
                            id: id,
                            value: value
                        }
                    });
                }}
            />
        </div>
    );
}
  
export default TextEditor;
  