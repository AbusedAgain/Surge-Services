import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './pages/index';
import './locales';

const element = document.getElementById('app') as HTMLElement;
const root = ReactDOM.createRoot(element);

root.render(<App />);
