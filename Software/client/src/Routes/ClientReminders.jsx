import { useContext } from 'react';
import Header from '../components/Header';
import SettingsContext from '../contexts/SettingsContext';

export default function ClientReminders() {
  return (
    <>
      <Header title="Reminders" />
      <div className="flex-col flex-grow p-3">
        <div>
          <h2 className="font-bold"></h2>
        </div>
      </div>
    </>
  );
}
