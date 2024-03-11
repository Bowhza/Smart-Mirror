import { useState } from 'react';

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

function Reminder({ reminderName, startDate, endDate }) {
  return (
    // <div className="flex gap-4 justify-between p-2 rounded-md bg-neutral-800 border-neutral-500 bg">
    <div className="flex flex-col gap-2 py-2 px-3 rounded-md bg-zinc-800 border-2 border-neutral-700">
      <p className="font-bold">{reminderName}</p>
      <div className="flex gap-2">
        <p>Start: {startDate}</p>
        <p>End: {endDate}</p>
      </div>
    </div>
  );
}

export default function Reminders() {
  const displayedReminders = testReminders.slice(0, 3);
  return (
    <div className="m-3 flex-col md:col-start-6 md:col-span-2 text-neutral-50">
      <h1 className="font-bold text-xl pb-2">Reminders</h1>
      <div className="flex-col space-y-2">
        {displayedReminders.map((reminder, index) => (
          <Reminder key={index} {...reminder} />
        ))}
      </div>
    </div>
  );
}
