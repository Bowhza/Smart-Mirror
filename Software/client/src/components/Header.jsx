export default function Header({ title }) {
  return (
    // Header element with sticky positioning and a border
    <header className="border-b-2 sticky top-0 px-3 py-2 z-10 bg-neutral-100">
      <h1 className="text-4xl font-sans font-bold">{title}</h1>
    </header>
  );
}
