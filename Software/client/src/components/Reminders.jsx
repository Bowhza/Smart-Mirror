import { useEffect, useState } from 'react';

const testReminders = [
  {
    reminderName: 'Go home, do homework.',
    startDate: 'Today',
    endDate: 'Tomorrow',
  },
  {
    reminderName: 'Go to class, do classwork.',
    startDate: 'Monday',
    endDate: 'April 26',
  },
  {
    reminderName: 'Whatever happens on this day.',
    startDate: 'Now',
    endDate: 'June 26',
  },

  {
    reminderName: 'Extra event',
    startDate: 'Tomorrow',
    endDate: 'December 31',
  },
];

function Reminder({ eventTitle, dateAdded, endDate }) {
  return (
    <div className="flex flex-col gap-2 py-2 px-3 rounded-md bg-zinc-800 border-2 border-neutral-700">
      <p className="font-bold">{eventTitle}</p>
      <div className="flex gap-2">
        <p>Start: {dateAdded}</p>
        <p>End: {endDate}</p>
      </div>
    </div>
  );
}

export default function Reminders() {
  const hostIP = import.meta.env.VITE_HOST;
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch(`http://${hostIP}:5174/get_reminders/1`, { mode: 'cors' })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setReminders(data);
      })
      .catch(error => console.log(error));
  }, []);

  const displayedReminders = reminders.slice(0, 5);
  return (
    <div className="m-3 flex-col md:col-start-6 md:col-span-2 text-neutral-50">
      <h1 className="font-bold text-2xl pb-2">Reminders</h1>
      <div className="flex-col space-y-2">
        {displayedReminders.length === 0 ? (
          <p className="font-bold">No reminders to display.</p>
        ) : (
          displayedReminders.map((reminder, index) => <Reminder key={index} {...reminder} />)
        )}
      </div>
    </div>
  );
}
