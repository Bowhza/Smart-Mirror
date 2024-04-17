export default function Button({ text, color, onClick, className }) {
  return (
    // Button element with onClick handler and dynamic class names
    <button onClick={onClick} className={`px-5 py-2 rounded-md text-neutral-100 font-bold ${color} ${className}`}>
      {text}
    </button>
  );
}
