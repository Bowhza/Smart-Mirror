import { FaRegCalendarCheck } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';
import { TiWeatherPartlySunny } from 'react-icons/ti';

export default function Client() {
  return (
    <div className="text-neutral-100 sm:flex-col">
      <header className="border-b-2 fixed top-0 left-0 right-0 p-2">
        <h1 className="text-3xl font-bold">Smart Mirror</h1>
      </header>
      <main></main>
      <nav
        className="grid grid-cols-4 fixed bottom-0 left-0 right-0 border-t-2 
      border-zinc-600 pt-1.5"
      >
        {options.map((item, index) => {
          return <NavItem info={item} />;
        })}
      </nav>
    </div>
  );
}

const options = [
  {
    title: 'Weather',
    icon: <TiWeatherPartlySunny className="size-8" />,
  },
  {
    title: 'Reminders',
    icon: <FaRegCalendarCheck className="size-8" />,
  },
  {
    title: 'Users',
    icon: <FaUsersCog className="size-8" />,
  },
  {
    title: 'Settings',
    icon: <IoMdSettings className="size-8" />,
  },
];

function NavItem({ info }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {info.icon}
      <p className="text-center">{info.title}</p>
    </div>
  );
}
