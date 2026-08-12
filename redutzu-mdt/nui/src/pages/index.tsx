import React, { useState } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from 'react-query';

// Types
import Modal from '../types/modal';

// Context
import ModalContext from '../contexts/Modal';

// Components
import Container from '../components/Container';
import Navigation from '../components/Navigation';
import Wrapper from '../components/Wrapper';
import Modals from '../components/Modals';

// Pages
import Alerts from './Alerts';
import Charge from './Charge';
import Charges from './Charges';
import Citizen from './Citizen';
import Citizens from './Citizens';
import Code from './Code';
import Codes from './Codes';
import Configuration from './Configuration';
import Dashboard from './Dashboard';
import Evidence from './Evidence';
import Evidences from './Evidences';
import Fine from './Fine';
import Fines from './Fines';
import House from './House';
import Houses from './Houses';
import Incident from './Incident';
import Incidents from './Incidents';
import Officers from './Officers';
import Vehicle from './Vehicle';
import Vehicles from './Vehicles';
import Warrant from './Warrant';
import Warrants from './Warrants';
import Announcements from './Announcements';
import Announcement from './Announcement';
import Bolos from './Bolos';
import Bolo from './Bolo';

const client = new QueryClient();

const App: React.FC = () => {
  const [modals, setModals] = useState<Modal[]>([]);
  const createModal = (modal: Modal) => setModals((modals) => [...modals, modal]);

  return (
    <MemoryRouter>
      <QueryClientProvider client={client}>
        <ModalContext.Provider value={{ createModal }}>
          <MantineProvider theme={{ colorScheme: 'dark' }}>
            <NotificationsProvider position='top-right'>
              <Container>
                <Modals modals={modals} setModals={setModals} />
                <Navigation links={window.CONFIG.PAGES} />

                <Wrapper>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/incidents' element={<Incidents />} />
                  <Route path='/incident/:id' element={<Incident />} />
                  <Route path='/evidences' element={<Evidences />} />
                  <Route path='/evidence/:id' element={<Evidence />} />
                  <Route path='/warrants' element={<Warrants />} />
                  <Route path='/warrant/:id' element={<Warrant />} />
                  <Route path='/officers' element={<Officers />} />
                  <Route path='/alerts' element={<Alerts />} />
                  <Route path='/citizens' element={<Citizens />} />
                  <Route path='/citizen/:identifier' element={<Citizen />} />
                  <Route path='/vehicles' element={<Vehicles />} />
                  <Route path='/vehicle/:plate' element={<Vehicle />} />
                  <Route path='/houses' element={<Houses />} />
                  <Route path='/house/:id' element={<House />} />
                  <Route path='/fine/:id' element={<Fine />} />
                  <Route path='/fines' element={<Fines />} />
                  <Route path='/charge/:id' element={<Charge />} />
                  <Route path='/charges' element={<Charges />} />
                  <Route path='/codes' element={<Codes />} />
                  <Route path='/code/:id' element={<Code />} />
                  <Route path='/announcements' element={<Announcements />} />
                  <Route path='/announcement/:id' element={<Announcement />} />
                  <Route path='/bolos' element={<Bolos />} />
                  <Route path='/bolo/:id' element={<Bolo />} />
                  <Route path='/config' element={<Configuration />} />
                </Wrapper>
              </Container>
            </NotificationsProvider>
          </MantineProvider>
        </ModalContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  )
}

export default App;
