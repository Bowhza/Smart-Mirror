import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { FaHome } from 'react-icons/fa';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import ClientHome from './Routes/ClientHome';
import ClientReminders from './Routes/ClientReminders';
import ClientUsers from './Routes/ClientUsers';
import ClientSettings from './Routes/ClientSettings';

export default function Client() {
  return (
    <div className="text-neutral-100 flex flex-col h-svh">
      <BrowserRouter>
        <Routes>
          <Route path="/" Component={ClientHome} />
          <Route path="/reminders" Component={ClientReminders} />
          <Route path="/users" Component={ClientUsers} />
          <Route path="/settings" Component={ClientSettings} />
        </Routes>
        <NavBar />
      </BrowserRouter>
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
    <nav className="grid grid-cols-4 fixed bottom-0 left-0 right-0 font-bold border-t-2 border-zinc-700">
      {options.map((item, index) => {
        return <NavItem info={item} />;
      })}
    </nav>
  );
}

function NavItem({ info }) {
  return (
    <NavLink
      to={info.route}
      className={({ isActive, isPending }) =>
        [isActive ? 'bg-zinc-600 transition duration-500' : 'bg-zinc-800'].join(' ')
      }
    >
      <div className="flex flex-col items-center justify-center pt-1.5 pb-1">
        {info.icon}
        <p className="text-center">{info.title}</p>
      </div>
    </NavLink>
  );
}
