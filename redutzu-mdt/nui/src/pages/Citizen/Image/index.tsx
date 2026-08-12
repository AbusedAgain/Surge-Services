import React, { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { fetchNui } from '../../../utils/misc';

// Components
import Tooltip from '../../../components/Tooltip';

// Assets
import Placeholder from '../../../assets/default-profile.png';

interface Props {
    identifier?: string;
    mdt_image: string | null;
    onChange: (...args: any[]) => any;
}

const Image: React.FC<Props> = ({ identifier, mdt_image, onChange }) => {
    const { t } = useTranslation('translation');

    const ref = useRef(null);
    const [preview, setPreview] = useState(false);

    useClickOutside(ref, (event: MouseEvent) => {
        event.preventDefault();

        if (!preview) return;
        setPreview(false);
    });

    const change = useCallback(() => {
        fetchNui('SetOpacity', 0);
        fetchNui('TakeScreenshot')
            .then(data => {
                onChange({
                    target: {
                        id: 'image',
                        value: data
                    }
                });

                fetchNui('update', {
                    type: 'citizen',
                    identifierType: 'identifier',
                    identifier: identifier,
                    values: { mdt_image: data }
                });

                fetchNui('SetOpacity', 1);
            });
    }, []);

    return (
        <Tooltip text={t('common.tooltip.image')}>
            <img
                ref={ref}
                className={preview ? 'preview' : ''}
                src={mdt_image || Placeholder}
                alt='profile-picture'
                onClick={change}
                referrerPolicy='no-referrer'
                onContextMenu={() => setPreview(!preview)}
            />
        </Tooltip>
    );
}

export default Image;
