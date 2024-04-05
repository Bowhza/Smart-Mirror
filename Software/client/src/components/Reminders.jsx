import { useEffect, useRef, useState, forwardRef } from 'react';

const Reminder = forwardRef(({ title, description, startDate, endDate, isFocused }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col py-2 px-3 rounded-md border-2 bg-zinc-800 ${isFocused ? 'border-blue-500' : 'border-neutral-700'}`}
    >
      <p className="font-bold">{title}</p>
      <p>{description}</p>
      <div className="flex justify-between">
        <p>Start: {startDate}</p>
        <p>End: {endDate}</p>
      </div>
    </div>
  );
});

export default function Reminders({ reminders }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const firstReminderRef = useRef(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowUp') {
        setFocusedIndex(prevIndex => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'ArrowDown') {
        setFocusedIndex(prevIndex => Math.min(prevIndex + 1, reminders.length - 1));
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reminders]);

  useEffect(() => {
    if (firstReminderRef.current) {
      firstReminderRef.current.focus();
    }
  }, []);

  const displayedReminders = reminders.slice(focusedIndex, focusedIndex + 5);

  return (
    <div className="m-3 flex-col md:col-start-6 md:col-span-2 text-neutral-50">
      <h1 className="font-bold text-2xl pb-2">Reminders</h1>
      <div className="flex-col space-y-2">
        {displayedReminders.length === 0 ? (
          <p className="font-bold">No reminders to display.</p>
        ) : (
          displayedReminders.map((reminder, index) => (
            <Reminder
              key={reminder.reminderID}
              title={reminder.title}
              description={reminder.description}
              startDate={reminder.startDate}
              endDate={reminder.endDate}
              isFocused={index === 0}
              ref={index === 0 ? firstReminderRef : null}
            />
          ))
        )}
      </div>
    </div>
  );
}
