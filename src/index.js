import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'typeface-roboto';
import registerServiceWorker from './registerServiceWorker';
import Controller from './screens/Controller';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Controller />);
registerServiceWorker();
