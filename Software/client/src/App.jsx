import Weather from './components/Weather';
import Reminders from './components/Reminders';

export default function App() {
  return (
    <>
      <div className="flex justify-between">
        <Weather />
        <Reminders />
      </div>
    </>
  );
}
