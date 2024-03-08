const testReminders = {
  reminder1: {
    reminderName: 'Go home',
    startDate: 'Today',
    endDate: 'Tomorrow',
  },
  reminder2: {
    reminderName: 'Go to class',
    startDate: 'Monday',
    endDate: 'April 26',
  },
  reminder3: {
    reminderName: 'Graduate(?)',
    startDate: 'Now',
    endDate: 'June 26',
  },
};

function Reminder({ reminderName, startDate, endDate }) {
  return (
    <div className="flex gap-4">
      <p>{reminderName}</p>
      <p>{startDate}</p>
      <p>{endDate}</p>
    </div>
  );
}

export default function Reminders() {
  return (
    <div className="p-1 border-2 m-2 border-neutral-900">
      <h2>Reminders: </h2>
      {Object.values(testReminders).map((reminder, index) => (
        <Reminder key={index} {...reminder} />
      ))}
    </div>
  );
}
