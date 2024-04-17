import { useContext, useState } from 'react';
import SettingsContext from '../contexts/SettingsContext';

// Component for a card representing a setting
export default function Card({ name, setting, initial }) {
  const falseState = 'bg-gradient-to-br from-rose-400 to-red-500'; // CSS class for false state
  const trueState = 'bg-gradient-to-br from-emerald-400 to-emerald-600'; // CSS class for true state
  const hostIP = import.meta.env.VITE_HOST; // Get host IP from environment variables

  const [updating, setUpdating] = useState(false); // State to track updating status
  const [settingState, setSettingState] = useState(initial); // State to store setting state
  const { settings, setSettings } = useContext(SettingsContext); // Context for settings

  // Function to update the setting
  const updateSetting = () => {
    setUpdating(true); // Start updating
    fetch(`http://${hostIP}:5174/update_sensor_settings/${setting}`, { method: 'POST' }) // Fetch API
      .then(res => res.json()) // Parse response
      .then(data => {
        setSettingState(data); // Update setting state
        setSettings({ ...settings, [setting]: data }); // Update settings context
      })
      .catch(error => console.error('Error updating setting:', error)) // Log errors
      .finally(() => setUpdating(false)); // Stop updating
  };

  return (
    <div
      className={`${settingState ? trueState : falseState} h-24 w-full rounded-lg cursor-pointer drop-shadow-lg`}
      onClick={() => {
        if (!updating) {
          updateSetting(); // Call updateSetting only if not currently updating
        }
      }}
    >
      {updating ? ( // Show loading spinner if updating
        <div className="h-full flex items-center justify-center">
          <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-neutral-100"></span>
        </div>
      ) : (
        <h1 className="text-lg p-2 font-bold text-neutral-100">{name}</h1> // Show setting name if not updating
      )}
    </div>
  );
}
