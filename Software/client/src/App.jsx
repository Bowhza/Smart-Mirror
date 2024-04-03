import Weather from './components/Weather';
import Reminders from './components/Reminders';
import News from './components/News';
import { useContext, useState, useEffect } from 'react';
import SettingsContext from './contexts/SettingsContext';
import { io } from 'socket.io-client';

const socket = io(`http://${import.meta.env.VITE_HOST}:5174`);
const hostIP = import.meta.env.VITE_HOST;

export default function App() {
  const { fetchSettings, settings } = useContext(SettingsContext);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // Fetch reminders immediately after component mounts
    fetchReminders();

    // Set up socket event listeners
    socket.on('update', msg => {
      fetchSettings();
    });

    socket.on('reminders', response => {
      console.log(response);
      setReminders(response.reminders);
    });

    // Cleanup function to remove socket event listeners
    return () => {
      socket.off('update');
      socket.off('reminders');
    };
  }, []);

  function fetchReminders() {
    fetch(`http://${hostIP}:5174/get_reminders/${settings.defaultUserID}`, { mode: 'cors' })
      .then(res => res.json())
      .then(data => {
        setReminders(data);
      })
      .catch(error => console.log(error));
  }

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden bg-neutral-900">
        <div className="grid md:grid-cols-7 text-neutral-50 flex-grow">
          {settings ? (
            <>
              <Weather settings={settings} />
              <Reminders reminders={reminders} />
            </>
          ) : null}
          <News />
        </div>
      </div>
    </>
  );
}
