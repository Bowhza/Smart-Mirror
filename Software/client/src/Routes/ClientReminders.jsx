import { useContext, useState } from 'react';
import Header from '../components/Header';
import SettingsContext from '../contexts/SettingsContext';

export default function ClientReminders() {
  const [dates, setDates] = useState({
    startDate: new Date().toISOString().slice(0, 16), // Format the current date to "yyyy-MM-ddThh:mm"
    endDate: null,
  });

  return (
    <>
      <Header title="Reminders" />
      <div className="flex-col flex-grow p-3">
        <div>
          <h2 className="font-bold">Add Reminder</h2>
          <input
            className="border-2 w-full rounded-md h-10 shadow-sm focus:border-neutral-400 outline-none px-2 bg-neutral-100"
            type="text"
            name="reminder"
            id="reminder"
          />
          <div>
            <label htmlFor="">Start Date</label>
            <input
              value={dates.startDate}
              onChange={e => setDates({ ...dates, startDate: e.target.value })}
              type="datetime-local"
            />
          </div>
          <div>
            <label htmlFor="">End Date</label>
            <input onChange={e => setDates({ ...dates, endDate: e.target.value })} type="datetime-local" />
          </div>
        </div>
      </div>
    </>
  );
}
