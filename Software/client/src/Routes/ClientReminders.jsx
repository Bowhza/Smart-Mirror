import { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Notification from '../components/Notification';

export default function ClientReminders({ selectedUserID }) {
  const hostIP = import.meta.env.VITE_HOST;
  const [reminders, setReminders] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [response, setResponse] = useState({});

  useEffect(() => {
    fetchReminders();
  }, [selectedUserID]);

  const APIRequest = (path, method) => {
    return fetch(`http://${hostIP}:5174/${path}`, { method })
      .then(res => {
        setResponse(prev => ({ ...prev, color: res.ok ? 'green' : 'red' }));
        return res.json();
      })
      .then(data => {
        console.log(data);
        setResponse(prev => ({ ...prev, message: data.message }));
      })
      .catch(error => {
        setResponse(prev => ({ ...prev, message: error.message }));
      })
      .finally(() => {
        setShowBanner(true);
      });
  };

  const fetchReminders = () => {
    fetch(`http://${hostIP}:5174/get_reminders/${selectedUserID}`, { mode: 'cors' })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setReminders(data);
      })
      .catch(error => console.log(error));
  };

  const deleteReminder = reminderID => {
    if (reminderID) {
      APIRequest(`delete_reminder/${reminderID}`, 'DELETE').then(fetchReminders);
    }
  };

  return (
    <>
      <Header title="Reminders" />
      <div className="flex flex-col flex-grow p-3 gap-3 pb-24">
        <AddReminder />
        <RemindersList reminders={reminders} deleteReminder={deleteReminder} />
        {showBanner && (
          <Notification
            message={response.message}
            showBanner={showBanner}
            setShowBanner={setShowBanner}
            color={response.color}
          />
        )}
      </div>
    </>
  );
}

function AddReminder() {
  return (
    <div>
      <h2 className="font-bold text-2xl">Add Reminder</h2>
      <h3 className="font-bold">Reminder Title</h3>
      <input
        className="border-2 w-full rounded-md h-10 shadow-sm focus:border-neutral-400 outline-none px-2 bg-neutral-100"
        type="text"
        name="reminder"
        id="reminder"
      />
      <h3 className="font-bold">Reminder Description</h3>
      <input
        className="border-2 w-full rounded-md h-10 shadow-sm focus:border-neutral-400 outline-none px-2 bg-neutral-100"
        type="text"
        name="reminder"
        id="reminder"
      />
    </div>
  );
}

function RemindersList({ reminders, deleteReminder }) {
  return (
    <div className="grid grid-flow-row">
      <h2 className="font-bold text-2xl">Stored Reminders</h2>
      <div className="flex flex-col gap-3">
        {reminders && reminders.length > 0 ? (
          reminders.map((reminder, index) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-2 py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm"
              >
                <h2 className="font-bold text-xl">{reminder.eventTitle}</h2>
                <div className="flex gap-2">
                  <p>Start: {reminder.dateAdded}</p>
                  <p>End: {reminder.endDate}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-grow"
                    text="Delete"
                    color="bg-gradient-to-br from-rose-400 to-red-500"
                    onClick={() => deleteReminder(reminder.reminderID)}
                  />
                  <Button
                    className="flex-grow"
                    text="Update"
                    color="bg-gradient-to-br from-emerald-400 to-emerald-600"
                    onClick={() => {}}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <h2 className="font-bold text-3xl text-center m-3 text-neutral-300">No Reminders Found</h2>
        )}
      </div>
    </div>
  );
}
