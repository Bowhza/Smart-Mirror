import Weather from './components/Weather';
import Reminders from './components/Reminders';
import News from './components/News';

export default function App() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="grid md:grid-cols-7 text-neutral-50 flex-1">
          <Weather />
          <Reminders />
          <News />
        </div>
      </div>
    </>
  );
}
