import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';

import { NavLink, Route, Routes } from 'react-router-dom';
import ClientHome from './Routes/ClientHome';
import ClientReminders from './Routes/ClientReminders';
import ClientUsers from './Routes/ClientUsers';
import ClientSettings from './Routes/ClientSettings';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(`http://${import.meta.env.VITE_HOST}:5174`);

export default function Client() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div className="flex flex-col h-svh">
      <Routes>
        <Route path="/" element={<ClientHome isConnected={isConnected} />} />
        <Route path="/reminders" Component={ClientReminders} />
        <Route path="/users" Component={ClientUsers} />
        <Route path="/settings" Component={ClientSettings} />
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