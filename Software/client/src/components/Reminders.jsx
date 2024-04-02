import { useEffect, useState } from 'react';

function Reminder({ title, description, startDate, endDate }) {
  return (
    <div className="flex flex-col gap-2 py-2 px-3 rounded-md bg-zinc-800 border-2 border-neutral-700">
      <p className="font-bold">{title}</p>
      <p>{description}</p>
      <div className="flex gap-2">
        <p>Start: {startDate}</p>
        <p>End: {endDate}</p>
      </div>
    </div>
  );
}

export default function Reminders({ userID }) {
  const hostIP = import.meta.env.VITE_HOST;
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetch(`http://${hostIP}:5174/get_reminders/${userID}`, { mode: 'cors' })
      .then(res => res.json())
      .then(data => {
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
