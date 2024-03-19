import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { TiWeatherPartlySunny } from 'react-icons/ti';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ClientWeather from './components/Routes/ClientWeather';
import ClientReminders from './components/Routes/ClientReminders';
import ClientUsers from './components/Routes/ClientUsers';
import ClientSettings from './components/Routes/ClientSettings';

export default function Client() {
  return (
    <div className="text-neutral-100 sm:flex-co">
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" Component={ClientWeather} />
            <Route path="/reminders" Component={ClientReminders} />
            <Route path="/users" Component={ClientUsers} />
            <Route path="/settings" Component={ClientSettings} />
          </Routes>
        </main>
        <NavBar />
      </BrowserRouter>
    </div>
  );
}

const options = [
  {
    title: 'Weather',
    icon: <TiWeatherPartlySunny className="size-7" />,
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
    <nav
      className="grid grid-cols-4 fixed bottom-0 left-0 right-0 border-t-2 
      border-zinc-600 py-1.5"
    >
      {options.map((item, index) => {
        return <NavItem info={item} />;
      })}
    </nav>
  );
}

function NavItem({ info }) {
  return (
    <Link to={info.route}>
      <div className="flex flex-col items-center justify-center">
        {info.icon}
        <p className="text-center">{info.title}</p>
      </div>
    </Link>
  );
}
