import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchNui } from '../../../utils/misc';

// Components
import Button from '../../Button';

// Types
interface Props {
    setImages: (...args: any[]) => void;
}

const Screenshot: React.FC<Props> = ({ setImages }) => {
    const { t } = useTranslation('translation');
    
    const onClick = useCallback(() => {
        fetchNui('SetOpacity', 0);
        fetchNui('TakeScreenshot')
            .then(data => {
                fetchNui('SetOpacity', 1);
                setImages((images: string[]) => [...images, data]);
            });
    }, []);

    return (
        <Button
            label={t('warrants.screenshot')}
            style={{ width: '100%' }}
            onClick={onClick}
        />
    );
}
  
export default Screenshot;
  