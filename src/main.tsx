import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EagleDebugger } from './Debugger';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <EagleDebugger>
      <App />
    </EagleDebugger>
  </React.StrictMode>
);
