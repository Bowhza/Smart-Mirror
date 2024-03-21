import Weather from './components/Weather';
import Reminders from './components/Reminders';
import News from './components/News';
import { useContext } from 'react';
import SettingsContext from './contexts/SettingsContext';

export default function App() {
  const { settings, loading } = useContext(SettingsContext);

  return (
    <>
      <div className="flex flex-col h-screen overflow-hidden bg-neutral-900">
        <div className="grid md:grid-cols-7 text-neutral-50 flex-1">
          {!loading ? (
            <>
              <Weather />
              <Reminders />
              <News />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
