import React, { useState, useEffect, useRef } from 'react';
import { useIsMount } from '../../hooks/useIsMount';
import { CSSTransition } from 'react-transition-group';
import { useEvent } from '../../hooks/useEvent';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useEventListener } from '../../hooks/useEventListener';
import { isBrowser, fetchNui } from '../../utils/misc';
import { showNotification } from '@mantine/notifications';
import i18n from '../../locales';

import './styles.scss';
import { useTranslation } from 'react-i18next';

interface Props {
    children: React.ReactNode;
}

const element = document.documentElement.style;

const Container: React.FC<Props> = ({ children }) => {
    const { t } = useTranslation('translation');

    const mounting = useIsMount();

    const [visible, setVisible] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [animating, setAnimating] = useState(false);

    const node = useRef(null);

    useEvent('setVisible', setVisible);
    useEvent('setOpacity', setOpacity);

    // Colors
    const [main] = useLocalStorage('main', window.CONFIG.COLORS['main']);
    const [secondary] = useLocalStorage('secondary', window.CONFIG.COLORS['secondary']);
    const [third] = useLocalStorage('third', window.CONFIG.COLORS['third']);
    const [highlight] = useLocalStorage('highlight', window.CONFIG.COLORS['highlight']);
    const [contrast] = useLocalStorage('contrast', window.CONFIG.COLORS['contrast']);
    const [text] = useLocalStorage('text', window.CONFIG.COLORS['text']);

    useEffect(() => {
        element.setProperty(`--main`, main);
        element.setProperty(`--secondary`, secondary);
        element.setProperty(`--third`, third);
        element.setProperty(`--highlight`, highlight);
        element.setProperty(`--contrast`, contrast);
        element.setProperty(`--text`, text);
    }, [main, secondary, third, highlight, contrast, text]);

    // Language
    const [language] = useLocalStorage('language', window.CONFIG.DEFAULT_LOCALE);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    // Transparency Listener
    useEventListener('keydown', (event: any) => {
        let TRANSPARENCY = window.CONFIG.SETTINGS.FEATURES.TRANSPARENCY;

        if (TRANSPARENCY.ENABLED) {
            if (event.code == TRANSPARENCY.KEY) {
                if (opacity == TRANSPARENCY.VALUE) {
                    fetchNui('SetOpacity', 1);
                    return;
                }

                fetchNui('SetOpacity', TRANSPARENCY.VALUE);
            }
        }
    });

    // Alerts Listener
    useEvent('SetAlerts', () => {
        let ALERTS = window.CONFIG.SETTINGS.FEATURES.ALERTS;
    
        if (ALERTS.ENABLED) {
            if (!ALERTS.WHILE_CLOSED && visible) {
                return showNotification({
                    title: t('alerts.notification.opened.title') as string,
                    message: t('alerts.notification.opened.message') as string,
                    autoClose: 5000
                });
            }

            if (ALERTS.WHILE_CLOSED) {
                return showNotification({
                    title: t('alerts.notification.closed.title') as string,
                    message: t('alerts.notification.closed.message') as string,
                    autoClose: 5000
                });
            }
        }
    });

    // Visibility Listener
    useEffect(() => {
        if (!visible) return;

        const handler = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                if (!isBrowser) return fetchNui('hide');
                return setVisible(false);
            }
        }

        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, [visible]);
    
    // Fade-in/out animation
    useEffect(() => {
        if (mounting) return;
        
        setAnimating(true);

        setTimeout(() => {
            setAnimating(false);
        }, 1000);
    }, [visible]);

    return (
        <CSSTransition 
            in={visible}
            nodeRef={node}
            timeout={200}
        >
            {   
                animating || visible ? (
                    <div 
                        id='container'
                        className={`${animating ? 'anim-' : ''}${visible ? 'in' : 'out'}`}
                        style={{ opacity }}
                        ref={node}
                    >
                        {children}
                    </div> 
                ) : <></> 
            }
        </CSSTransition> 
    )
  }
  
  export default Container;
  