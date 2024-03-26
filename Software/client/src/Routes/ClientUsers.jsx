import Header from '../components/Header';
import Input from '../components/Input';
import Notification from '../components/Notification';
import { useEffect, useState } from 'react';
import Button from '../components/Button';

export default function ClientUsers() {
  const hostIP = import.meta.env.VITE_HOST;
  const [response, setResponse] = useState({});
  const [showBanner, setShowBanner] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch(`http://${hostIP}:5174/get_users`, { mode: 'cors', method: 'GET' })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUsers(data);
      });
  };

  const handleAPIRequest = (path, method) => {
    return fetch(`http://${hostIP}:5174/${path}`, { method })
      .then(res => {
        setResponse(prev => ({ ...prev, color: res.status === 200 ? 'green' : 'red' }));
        return res.json();
      })
      .then(data => {
        setResponse(prev => ({ ...prev, message: data.message }));
      })
      .catch(error => {
        setResponse(prev => ({ ...prev, message: error.message }));
      })
      .finally(() => {
        setShowBanner(true);
      });
  };

  const AddUser = Username => {
    if (Username.trim().length > 0) {
      handleAPIRequest(`add_user/${Username}`, 'POST').then(fetchUsers);
    }
  };

  const setUser = userID => {
    if (userID) {
      handleAPIRequest(`set_user/${userID}`, 'POST').then(fetchUsers);
    }
  };

  const deleteUser = userID => {
    if (userID) {
      handleAPIRequest(`delete_user/${userID}`, 'DELETE').then(fetchUsers);
    }
  };

  return (
    <>
      <Header title="Users" />
      <div className="flex-col flex-grow p-3">
        {showBanner && (
          <Notification
            message={response.message}
            showBanner={showBanner}
            setShowBanner={setShowBanner}
            color={response.color}
          />
        )}
        <Input label="Add User" placeholder="ex. Admin" data="" buttonLabel="Submit" method={AddUser} />

        <div className="grid grid-flow-row row-auto gap-3 mt-3">
          {users.length > 0 &&
            users.map((item, index) => {
              console.log(item);
              return (
                <div key={item.userID} className="flex justify-between items-center">
                  <h3 className="font-bold">{item.userName}</h3>
                  <div className="flex gap-3">
                    <Button
                      text="Select"
                      color="bg-gradient-to-br from-emerald-400 to-emerald-600"
                      onClick={() => setUser(item.userID)}
                    />
                    <Button
                      text="Delete"
                      color="bg-gradient-to-br from-rose-400 to-red-500"
                      onClick={() => deleteUser(item.userID)}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
