import { useEffect, useRef, useState, forwardRef } from 'react';

const Reminder = forwardRef(({ index, title, description, startDate, endDate, isFocused }, ref) => {
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const checkOverdueStatus = () => {
      const currentDate = new Date();
      const endDateTime = new Date(endDate);
      const isPastDue = currentDate > endDateTime;
      setIsOverdue(isPastDue);
    };

    //Initial check
    checkOverdueStatus();

    //Set up a timer to periodically check the overdue status
    const timerId = setInterval(checkOverdueStatus, 20000); // Check every minute

    return () => {
      clearInterval(timerId); // Clean up the timer
    };
  }, [endDate]);

  return (
    <div
      ref={ref}
      className={`flex flex-col py-2 px-3 rounded-md border-2 bg-zinc-800 ${isFocused ? 'border-blue-500' : 'border-neutral-700'}`}
    >
      <div className={`flex justify-between ${isOverdue && 'text-red-500'} `}>
        <p className="font-bold">{title}</p>
        <p className={`${isOverdue ? 'text-red-500' : 'text-neutral-500'} font-bold text-lg`}>{index + 1}</p>
      </div>
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

  let displayedReminders;
  if (focusedIndex < 5) {
    displayedReminders = reminders.slice(0, 5);
  } else {
    displayedReminders = reminders.slice(focusedIndex - 4, focusedIndex + 1);
  }

  if (focusedIndex >= reminders.length) setFocusedIndex(reminders.length - 1);

  return (
    <div className="m-3 flex-col md:col-start-6 md:col-span-2 text-neutral-50">
      <h1 className="font-bold text-2xl pb-2">Reminders</h1>
      <div className="flex-col space-y-2">
        {displayedReminders.length === 0 ? (
          <p className="font-bold">No reminders to display.</p>
        ) : (
          displayedReminders.map((reminder, index) => {
            // Calculate the relative index of the reminder
            const relativeIndex = focusedIndex < 5 ? index : focusedIndex - 4 + index;
            // Determine if the reminder is focused
            const isFocused = relativeIndex === focusedIndex;

            return (
              <Reminder
                key={reminder.reminderID}
                index={relativeIndex}
                title={reminder.title}
                description={reminder.description}
                startDate={reminder.startDate}
                endDate={reminder.endDate}
                isFocused={isFocused}
                ref={relativeIndex === focusedIndex ? firstReminderRef : null}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
