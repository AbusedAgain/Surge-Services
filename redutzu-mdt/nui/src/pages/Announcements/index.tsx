import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Tabs } from '@mantine/core';

import Page from '../../components/Page';
import List from './List';
import Form from './Form';

import './styles.scss';

const Announcements: React.FC = () => {
    const { t } = useTranslation('translation');

    return (
        <Page header={{ title: t('announcements.title'), subtitle: t('announcements.subtitle') }}>
            <Tabs className='tabs' defaultValue='list'>
                <Tabs.List>
                    <Tabs.Tab value='list' icon={<i className='fa-solid fa-list'></i>}>
                        <Trans>announcements.list</Trans>
                    </Tabs.Tab>
                    <Tabs.Tab value='create' icon={<i className='fa-solid fa-spell-check'></i>}>
                        <Trans>announcements.form</Trans>
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value='list'>
                    <List />
                </Tabs.Panel>

                <Tabs.Panel value='create'>
                    <Form />
                </Tabs.Panel>
            </Tabs>
        </Page>
    );
}

export default Announcements;
