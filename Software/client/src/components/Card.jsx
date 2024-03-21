import { useContext, useState } from 'react';
import SettingsContext from '../contexts/SettingsContext';

export default function Card({ name, setting, initial }) {
  const falseState = 'bg-gradient-to-br from-rose-400 to-red-500';
  const trueState = 'bg-gradient-to-br from-emerald-400 to-emerald-600';
  const hostIP = import.meta.env.VITE_HOST;

  const [updating, setUpdating] = useState(false);
  const [settingState, setSettingState] = useState(initial);
  const { settings, setSettings } = useContext(SettingsContext);

  const updateSetting = () => {
    setUpdating(true);
    fetch(`http://${hostIP}:5174/update_sensor_settings/${setting}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        setSettingState(data);
        setSettings({ ...settings, [setting]: data });
      })
      .catch(error => console.error('Error updating setting:', error))
      .finally(() => setUpdating(false));
  };

  return (
    <div
      className={`${settingState ? trueState : falseState} h-24 w-full rounded-lg cursor-pointer drop-shadow-lg`}
      onClick={() => {
        if (!updating) {
          updateSetting();
        }
      }}
    >
      {updating ? (
        <div className="h-full flex items-center justify-center">
          <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-neutral-100"></span>
        </div>
      ) : (
        <h1 className="text-lg p-2 font-bold text-neutral-100">{name}</h1>
      )}
    </div>
  );
}
