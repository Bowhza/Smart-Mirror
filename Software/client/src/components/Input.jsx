import { useState } from 'react';

export default function Input({ label, placeholder, data, buttonLabel, method }) {
  const [value, setValue] = useState(data);

  const isInvalid = 'bg-gradient-to-br from-rose-400 to-red-500';
  const isValid = 'bg-gradient-to-br from-emerald-400 to-emerald-600';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col">
        <p className="font-bold">{label}</p>
        <input
          onChange={e => {
            setValue(e.target.value);
          }}
          placeholder={placeholder}
          className="border-2 rounded-md h-10 shadow-sm focus:border-neutral-400 outline-none px-2"
          type="text"
          value={value}
        />
      </div>
      <div>
        <button
          className={`px-5 py-2 rounded-md text-neutral-100 font-bold ${value.length > 0 ? isValid : isInvalid}`}
          onClick={() => method(value)}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
