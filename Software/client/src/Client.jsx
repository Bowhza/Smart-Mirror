import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';

import { NavLink, Route, Routes } from 'react-router-dom';
import ClientHome from './Routes/ClientHome';
import ClientReminders from './Routes/ClientReminders';
import ClientUsers from './Routes/ClientUsers';
import ClientSettings from './Routes/ClientSettings';
import { useEffect } from 'react';

export default function Client() {
  return (
    <div className="flex flex-col h-svh">
      <Routes>
        <Route path="/" Component={ClientHome} />
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
    <nav className="grid grid-cols-4 fixed bottom-0 left-0 right-0 font-bold border-t-2">
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
