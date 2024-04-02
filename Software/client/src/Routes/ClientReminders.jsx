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

  const APIRequest = (path, method, body = {}) => {
    return fetch(`http://${hostIP}:5174/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON
      },
      body: JSON.stringify(body), // Convert the body object to JSON string
    })
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

  const addReminder = ({ details }) => {
    if (details) {
      APIRequest(`add_reminder/${selectedUserID}`, 'POST', { details }).then(fetchReminders);
    }
  };

  return (
    <>
      <Header title="Reminders" />
      <div className="flex flex-col flex-grow p-3 gap-3 pb-24">
        <AddReminder addReminder={addReminder} />
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

function AddReminder({ addReminder }) {
  const [show, setShow] = useState(false);
  const [details, setDetails] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
  });
  const dateTimeLocal = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const handleChange = e => {
    const { name, value } = e.target;
    setDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col">
      <h2 className="font-bold text-2xl">Add Reminder</h2>
      <div>
        <h3 className="font-bold">Reminder Title</h3>
        <input
          className="border-2 w-full rounded-md h-10 shadow-sm focus:border-neutral-400 outline-none px-2 bg-neutral-100"
          type="text"
          name="reminder"
          id="reminder"
          onChange={handleChange}
        />
      </div>
      <div>
        <h3 className="font-bold">Reminder Description</h3>
        <input
          className="border-2 w-full rounded-md h-10 shadow-sm focus:border-neutral-400 outline-none px-2 bg-neutral-100"
          type="text"
          name="reminder"
          id="reminder"
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1">
        <div>
          <p className="font-bold">Start Date</p>
          <input
            className="border-2 bg-neutral-100"
            type="datetime-local"
            name="start-date"
            id="start-date"
            onChange={handleChange}
            defaultValue={dateTimeLocal}
            min={dateTimeLocal}
          />
        </div>
        <div>
          <p className="font-bold">End Date</p>
          <input
            className="border-2 bg-neutral-100"
            type="datetime-local"
            name="end-date"
            id="end-date"
            onChange={handleChange}
            min={dateTimeLocal}
          />
        </div>
      </div>
      <div className="pt-3">
        <Button
          text="Add Reminder"
          color="bg-gradient-to-br from-emerald-400 to-emerald-600"
          onClick={() => {
            addReminder({ details }).then(setShow(false));
          }}
        />
      </div>
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
