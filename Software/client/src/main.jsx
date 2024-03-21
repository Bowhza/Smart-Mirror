import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Router from './Router.jsx';
import Client from './Client.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SettingsProvider>
      <Router />
    </SettingsProvider>
  </React.StrictMode>,
);
