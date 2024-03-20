import { useState } from 'react';

export default function Card({ setting }) {
  const falseState = 'bg-gradient-to-br from-rose-400 to-red-500';
  const trueState = 'bg-gradient-to-br from-emerald-400 to-emerald-600';

  const [settingState, setSettingState] = useState(false);
  return (
    <div
      className={`${settingState ? trueState : falseState} h-24 w-full rounded-lg`}
      onClick={() => setSettingState(!settingState)}
    >
      <h1 className="text-lg p-2 font-bold text-neutral-100">{setting}</h1>
    </div>
  );
}
