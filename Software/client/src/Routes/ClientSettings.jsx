import Header from '../components/Header';
import Card from '../components/Card';

export default function ClientSettings() {
  return (
    <>
      <Header title="Settings" />
      <div className="flex flex-col flex-grow p-3 gap-3 drop-shadow-lg">
        <p className="font-bold text-xl">Settings Testing</p>
        <div className="flex flex-col gap-3">
          <Card setting="Test Setting 1" />
          <Card setting="Test Setting 2" />
          <Card setting="Test Setting 3" />
        </div>
      </div>
    </>
  );
}
