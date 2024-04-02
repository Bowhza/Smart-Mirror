import Weather from './components/Weather';
import Reminders from './components/Reminders';
import News from './components/News';
import { useContext, useState, useEffect } from 'react';
import SettingsContext from './contexts/SettingsContext';
import { io } from 'socket.io-client';

const socket = io(`http://${import.meta.env.VITE_HOST}:5174`);

export default function App() {
  const { fetchSettings, settings } = useContext(SettingsContext);

  useEffect(() => {
    socket.on('update', msg => {
      fetchSettings();
    });

    return () => {
      socket.off('update');
    };
  }, []);

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden bg-neutral-900">
        <div className="grid md:grid-cols-7 text-neutral-50 flex-grow">
          {settings ? (
            <>
              <Weather settings={settings} />
              <Reminders userID={settings.defaultUserID} />
            </>
          ) : null}
          <News />
        </div>
      </div>
    </>
  );
}
