import Weather from './components/Weather';
import Reminders from './components/Reminders';

export default function App() {
  return (
    <>
      <div className="grid md:grid-cols-7 md:grid-rows-2 text-neutral-50">
        <Weather />
        <Reminders />
      </div>
    </>
  );
}
