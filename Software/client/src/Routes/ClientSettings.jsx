import { useContext, useState } from 'react';
import Header from '../components/Header';
import ButtonedInput from '../components/ButtonedInput';
import SettingCard from '../components/SettingCard';
import SettingsContext from '../contexts/SettingsContext';
import Toggle from '../components/Toggle';
import Slider from '../components/Slider';
import HoldButton from '../components/HoldButton';
import Notification from '../components/Notification';

export default function ClientSettings({ socket }) {
  const { settings, setSettings } = useContext(SettingsContext);
  const [is24Hour, setIs24Hour] = useState(settings.timeFormat === 'en-uk');
  const [response, setResponse] = useState({});
  const [showBanner, setShowBanner] = useState(false);
  const hostIP = import.meta.env.VITE_HOST;

  /**
   * Handles the toggle of time format between 12-hour and 24-hour.
   */
  const handleToggle = () => {
    const newIs24Hour = !is24Hour;

    setIs24Hour(newIs24Hour);

    // Use the new value directly in the fetch call
    fetch(`http://${hostIP}:5174/update_time_format/${newIs24Hour ? 'en-uk' : 'en-us'}`, { method: 'POST' })
      .then(res => {
        setResponse(prev => ({ ...prev, color: res.ok ? 'green' : 'red' }));
        return res.json();
      })
      .then(data => {
        console.log(data);
        socket.emit('update', 'Settings Updated');
        setResponse(prev => ({ ...prev, message: data.message }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        setShowBanner(true);
      });
  };

  /**
   * Updates the default location for weather.
   * @param {string} value - New default location value.
   */
  const updateLocation = value => {
    if (value.length > 0) {
      fetch(`http://${hostIP}:5174/update_location/${value}`)
        .then(res => {
          setResponse(prev => ({ ...prev, color: res.ok ? 'green' : 'red' }));
          return res.json();
        })
        .then(data => {
          console.log(data);
          setSettings({ ...settings, defaultLocation: value });
          setResponse(prev => ({ ...prev, message: data.message }));
          socket.emit('update', 'Settings Updated');
        })
        .catch(error => console.error(error))
        .finally(() => {
          setShowBanner(true);
        });
    }
  };

  /**
   * Updates the display state.
   */
  const updateDisplay = () => {
    fetch(`http://${hostIP}:5174/change_display_state`, { method: 'POST' })
      .then(res => {
        setResponse(prev => ({ ...prev, color: res.ok ? 'green' : 'red' }));
        return res.json();
      })
      .then(data => {
        console.log(data);
        setSettings({ ...settings, powerState: data.state });
        setResponse(prev => ({ ...prev, message: data.message }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        setShowBanner(true);
      });
  };

  /**
   * Updates the display brightness.
   * @param {number} value - New brightness level.
   */
  const updateBrightness = value => {
    fetch(`http://${hostIP}:5174/set_brightness/${value}`, { method: 'POST' })
      .then(res => {
        setResponse(prev => ({ ...prev, color: res.ok ? 'green' : 'red' }));
        return res.json();
      })
      .then(data => {
        console.log(data);
        setSettings({ ...settings, displayBrightness: data.level });
        setResponse(prev => ({ ...prev, message: data.message }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        setShowBanner(true);
      });
  };

  /**
   * Clears the database.
   */
  const clearDatabase = () => {
    fetch(`http://${hostIP}:5174/clear_db`, { method: 'DELETE', mode: 'cors' })
      .then(res => {
        setResponse(prev => ({ ...prev, color: res.ok ? 'green' : 'red' }));
        return res.json();
      })
      .then(data => {
        console.log(data);
        setResponse(prev => ({ ...prev, message: data.message }));
      })
      .catch(error => console.error(error))
      .finally(() => {
        setShowBanner(true);
      });
  };

  return (
    <>
      <Header title="Settings" />
      <div className="flex flex-col flex-grow p-3 gap-3 pb-24">
        {showBanner && (
          <Notification
            message={response.message}
            showBanner={showBanner}
            setShowBanner={setShowBanner}
            color={response.color}
          />
        )}
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

          <div className="flex flex-col gap-3">
            <div>
              <h2 className="font-bold text-2xl">Clear Database</h2>
              <p>
                <span className="font-bold text-red-600">Warning: </span>
                This will delete all <span className="font-bold">reminders</span> and{' '}
                <span className="font-bold">users</span> in the database. There is no way to revert this action.
              </p>
            </div>
            <HoldButton activationTime={3000} onActivate={clearDatabase} text="Hold to Clear Database" />
          </div>
        </div>
      </div>
    </>
  );
}
