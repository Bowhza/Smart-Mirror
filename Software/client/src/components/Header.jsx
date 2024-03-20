export default function Header({ title }) {
  return (
    <header className="border-b-2 sticky top-0 px-3 py-2 border-zinc-600 bg-zinc-800 z-1">
      <h1 className="text-4xl font-bold">{title}</h1>
    </header>
  );
}
