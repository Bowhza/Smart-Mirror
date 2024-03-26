export default function Button({ text, color, onClick }) {
  return (
    <button onClick={onClick} className={`px-5 py-2 rounded-md text-neutral-100 font-bold shadow-md ${color}`}>
      {text}
    </button>
  );
}
