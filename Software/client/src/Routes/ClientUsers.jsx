import Header from '../components/Header';
import Input from '../components/Input';
import { useState } from 'react';

export default function ClientUsers() {
  const hostIP = import.meta.env.VITE_HOST;
  const [response, setResponse] = useState({});

  const AddUser = Username => {
    if (Username.trim().length > 0) {
      fetch(`http://${hostIP}:5174/add_user/${Username}`, { method: 'POST' })
        .then(res => {
          setResponse({ status: res.status == 200 });
          console.log(res.status);
          return res.json();
        })
        .then(data => {
          console.log(data);
          setResponse({ ...response, message: data.message });
        })
        .catch(error => {
          console.error('Error:', error);
          setResponse({ ...response, message: error.message });
        });
    }
  };

  return (
    <>
      <Header title="Users" />
      <div className="flex-col flex-grow p-3">
        <div>
          <Input label="Add User" placeholder="ex. Admin" data="" buttonLabel="Submit" method={AddUser} />
        </div>
      </div>
    </>
  );
}
