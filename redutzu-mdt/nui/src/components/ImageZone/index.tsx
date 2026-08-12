import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

// Components
import Images from './Images';
import Link from './Link';
import Screenshot from './Screenshot';
import Tabs from './Tabs';

// Assets
import './styles.scss';

// Types
interface Props {
    id: string;
    value: string[];
    onChange: (...args: any[]) => void;
    onBlur: (...args: any[]) => void;
    error?: string | string[];
    touched?: boolean | boolean[];
}

// Constants
const TABS = ['Link', 'Screenshot'];

const ImageZone: React.FC<Props> = ({ id, value, onChange, onBlur, error, touched }) => {
    const { t } = useTranslation('translation');
    const [images, setImages] = useState(value);
    const [tab, setTab] = useState(TABS[0]);

    useEffect(() => {
        onChange({
            target: {
                id: id,
                value: images
            }
        });
    }, [images]);

    return (
        <div className='image-zone' onBlur={onBlur}>
            { 
                (error && touched) && <div className='error-message'>
                    <Trans t={t}>{error}</Trans>
                </div>
            }

            <div className='image-tabs'>
                <Tabs current={tab} tabs={TABS} setTab={setTab} />
                <div className='tab-content'>
                    {tab === 'Link' && <Link setImages={setImages} />}
                    {tab === 'Screenshot' && <Screenshot setImages={setImages} />}
                </div>
            </div>

            <Images images={images} setImages={setImages} />
        </div>
    );
}
  
export default ImageZone;
  