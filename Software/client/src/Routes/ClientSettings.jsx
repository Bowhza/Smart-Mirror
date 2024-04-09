import { useContext, useState } from 'react';
import Header from '../components/Header';
import ButtonedInput from '../components/ButtonedInput';
import SettingCard from '../components/SettingCard';
import SettingsContext from '../contexts/SettingsContext';
import Toggle from '../components/Toggle';
import Slider from '../components/Slider';
import Button from '../components/Button';

export default function ClientSettings({ socket }) {
  const { settings, setSettings } = useContext(SettingsContext);
  const [is24Hour, setIs24Hour] = useState(settings.timeFormat === 'en-uk');
  const hostIP = import.meta.env.VITE_HOST;

  const handleToggle = () => {
    const newIs24Hour = !is24Hour;

    setIs24Hour(newIs24Hour);

    // Use the new value directly in the fetch call
    fetch(`http://${hostIP}:5174/update_time_format/${newIs24Hour ? 'en-uk' : 'en-us'}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        socket.emit('update', 'Settings Updated');
      })
      .catch(error => console.error(error));
  };

  const updateLocation = value => {
    if (value.length > 0) {
      fetch(`http://${hostIP}:5174/update_location/${value}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setSettings({ ...settings, defaultLocation: value });
          socket.emit('update', 'Settings Updated');
        })
        .catch(error => console.error(error));
    }
  };

  const updateDisplay = () => {
    fetch(`http://${hostIP}:5174/change_display_state`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setSettings({ ...settings, powerState: data.state });
      })
      .catch(error => console.error(error));
  };

  const updateBrightness = value => {
    fetch(`http://${hostIP}:5174/set_brightness/${value}`, { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.error(error));
  };

  return (
    <>
      <Header title="Settings" />
      <div className="flex flex-col flex-grow p-3 gap-3 pb-24">
        <div className="flex flex-col gap-3">
          <div>
            <h2 className="font-bold text-2xl">General</h2>
            <ButtonedInput
              label="Weather Location"
              data={settings.defaultLocation}
              placeholder="Country, Region or City"
              buttonLabel="Set Location"
              method={updateLocation}
              clear={false}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold mb-4">Time Format</h2>
            <div className="flex items-center mb-4 justify-center">
              <span className="mr-2 font-bold drop-shadow-md">12-Hour Format</span>
              <Toggle isOn={is24Hour} handleToggle={handleToggle} />
              <span className="ml-2 font-bold drop-shadow-md">24-Hour Format</span>
            </div>
          </div>

          <div>
            <h2 className="font-bold text-2xl">Display Settings</h2>
            <p className="font-bold">Display Brightness</p>
            <Slider defaultValue={settings.displayBrightness} sliderFunction={updateBrightness} />

            <p className="font-bold">Display Power State</p>
            <button
              className={`${
                settings.powerState
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                  : 'bg-gradient-to-br from-rose-400 to-red-500'
              }
              px-5 py-2 mt-1 rounded-md text-neutral-100 font-bold w-full`}
              onClick={() => updateDisplay()}
            >
              {settings.powerState ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-bold text-2xl">Sensors</h2>
            <SettingCard name="Accelerometer" setting="accelerometer" initial={Boolean(settings.accelerometer)} />
            <SettingCard name="Ambient Light" setting="ambient" initial={Boolean(settings.ambient)} />
            <SettingCard name="Gesture Sensor" setting="gesture" initial={Boolean(settings.gesture)} />
            <SettingCard name="Proximity Sensor" setting="proximity" initial={Boolean(settings.proximity)} />
          </div>

          <div>
            <h2 className="font-bold text-2xl">Clear Database</h2>
          </div>
        </div>
      </div>
    </>
  );
}
