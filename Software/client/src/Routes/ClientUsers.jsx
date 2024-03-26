import Header from '../components/Header';
import Input from '../components/Input';
import Notification from '../components/Notification';
import { useState } from 'react';

export default function ClientUsers() {
  const hostIP = import.meta.env.VITE_HOST;
  const [response, setResponse] = useState({});
  const [showBanner, setShowBanner] = useState(false);

  const AddUser = Username => {
    if (Username.trim().length > 0) {
      fetch(`http://${hostIP}:5174/add_user/${Username}`, { method: 'POST' })
        .then(res => {
          setResponse(prev => ({ ...prev, color: res.status === 200 ? 'green' : 'red' }));
          return res.json();
        })
        .then(data => {
          setResponse(prev => ({ ...prev, message: data.message }));
        })
        .catch(error => {
          setResponse(prev => ({ ...prev, message: data.message }));
        })
        .finally(() => {
          setShowBanner(true);
        });
    }
  };

  console.log(response);

  return (
    <>
      <Header title="Users" />
      <div className="flex-col flex-grow p-3">
        <div>
          {showBanner && (
            <Notification
              message={response.message}
              showBanner={showBanner}
              setShowBanner={setShowBanner}
              color={response.color}
            />
          )}
          <Input label="Add User" placeholder="ex. Admin" data="" buttonLabel="Submit" method={AddUser} />
        </div>
      </div>
    </>
  );
}
