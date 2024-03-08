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
    <div className="bg-neutral-900/[.06] border-dashed border-4 border-grey-600">
      {Object.values(testReminders).map((reminder, index) => (
        <Reminder key={index} {...reminder} />
      ))}
      {/* <table className="table-auto">
        <thead>
          <tr>
            <th>Reminder</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>Reminder()</tbody>
      </table> */}
    </div>
  );
}
