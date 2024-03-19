export default function ClientWeather() {
  return (
    <div>
      <header className="border-b-2 p-2 border-zinc-600">
        <h1 className="text-4xl font-bold">Weather</h1>
      </header>
      <div className="p-3">
        <div className="flex flex-col">
          <h2 className="text-2xl">Location</h2>
          <input name="location" type="text" className="bg-zinc-600 flex-grow h-10" />
        </div>
      </div>
    </div>
  );
}
