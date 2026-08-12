import React, { useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import i18n from '../../locales';

// Components
import Page from '../../components/Page';
import Button from '../../components/Button';
import Tooltip from '../../components/Tooltip';
import Color from './Color';
import Language from './Language';

import './styles.scss';

const Configuration: React.FC = () => {
    const { t } = useTranslation('translation');

    const reset = useCallback(() => {
        let colors = Object.entries(window.CONFIG.COLORS);
        let element = document.documentElement.style;

        colors.forEach(([name, color]: any) => {
            element.setProperty(`--${name}`, color);
            window.localStorage.removeItem(name);
        });

        window.localStorage.removeItem('language');
        i18n.changeLanguage(window.CONFIG.DEFAULT_LOCALE);
    }, []);

    return (
        <Page header={{ title: t('configuration.title'), subtitle: t('configuration.subtitle') }}>
            <div className='config-layout'>
                <div className='colors'>
                    <div className='label'>
                        <h1><Trans t={t}>configuration.colors</Trans></h1>
                    </div>
                    <div className='colors-container'>
                        <Color name='main' label={t('configuration.main_color')} />
                        <Color name='secondary' label={t('configuration.secondary_color')} />
                        <Color name='third' label={t('configuration.third_color')} />
                        <Color name='highlight' label={t('configuration.highlight_color')} />
                        <Color name='contrast' label={t('configuration.contrast_color')} />
                        <Color name='text' label={t('configuration.text_color')} />
                    </div>
                </div>
                <div>
                    <div className='label'>
                        <Tooltip text={t('configuration.tooltip.language')} position='right'>
                            <h1><Trans t={t}>configuration.language</Trans></h1>
                        </Tooltip>
                    </div>
                    <Language />
                </div>
        
                <Button label={t('configuration.reset')} onClick={reset}/>
            </div>
        </Page>
    );
}

export default Configuration;
