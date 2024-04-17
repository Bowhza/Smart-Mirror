import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';

import { NavLink, Route, Routes } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import ClientHome from './Routes/ClientHome';
import ClientReminders from './Routes/ClientReminders';
import ClientUsers from './Routes/ClientUsers';
import ClientSettings from './Routes/ClientSettings';
import { io } from 'socket.io-client';
import SettingsContext from './contexts/SettingsContext';
import Loading from './components/Loading';

const socket = io(`http://${import.meta.env.VITE_HOST}:5174`);

export default function Client() {
  const [users, setUsers] = useState([]);
  const { settings, setSettings } = useContext(SettingsContext);
  const hostIP = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    fetch(`http://${hostIP}:5174/get_users`, { mode: 'cors', method: 'GET' })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setSettings({ ...settings, defaultUser: data.default, defaultUserID: data.id });
        socket.emit('reminders', 'Refresh Reminders.');
      });
  }

  if (settings == null) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col h-svh">
      <Routes>
        <Route path="/" element={<ClientHome socket={socket} />} />
        <Route
          path="/reminders"
          element={<ClientReminders selectedUserID={settings.defaultUserID} socket={socket} />}
        />
        <Route path="/users" element={<ClientUsers data={users} fetchUsers={fetchUsers} settings={settings} />} />
        <Route path="/settings" element={<ClientSettings socket={socket} />} />
      </Routes>
      <NavBar />
    </div>
  );
}

const options = [
  {
    title: 'Home',
    icon: <FaHome className="size-7" />,
    route: '/',
  },
  {
    title: 'Reminders',
    icon: <FaRegCalendarCheck className="size-7" />,
    route: '/reminders',
  },
  {
    title: 'Users',
    icon: <FaUsersCog className="size-7" />,
    route: '/users',
  },
  {
    title: 'Settings',
    icon: <IoMdSettings className="size-7" />,
    route: '/settings',
  },
];

function NavBar() {
  return (
    <nav className="grid grid-cols-4 fixed bottom-0 left-0 right-0 font-bold border-t-2 z-10">
      {options.map((item, index) => {
        return <NavItem key={index} info={item} />;
      })}
    </nav>
  );
}

function NavItem({ info }) {
  return (
    <NavLink
      to={info.route}
      className={({ isActive }) => (isActive ? 'bg-neutral-200 transition duration-500' : 'bg-neutral-50')}
    >
      <div className="flex flex-col items-center justify-center pt-1.5 pb-1">
        {info.icon}
        <p className="text-center">{info.title}</p>
      </div>
    </NavLink>
  );
}
