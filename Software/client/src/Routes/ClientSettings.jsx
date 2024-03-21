import { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Input from '../components/Input';
import SettingCard from '../components/SettingCard';
import SettingsContext from '../contexts/SettingsContext';

export default function ClientSettings() {
  const { settings, setSettings, loading } = useContext(SettingsContext);
  const hostIP = import.meta.env.VITE_HOST;

  const updateLocation = value => {
    if (value.length > 0) {
      fetch(`http://${hostIP}:5174/update_location/${value}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          setSettings({ ...settings, defaultLocation: value });
        })
        .catch(error => console.error(error));
    }
  };

  return (
    <>
      <Header title="Settings" />
      <div className="flex flex-col flex-grow p-3 gap-3">
        <div className="flex flex-col gap-3">
          {!loading ? (
            <>
              <h2 className="font-bold text-2xl">Location</h2>
              <Input
                label="Weather Location"
                data={settings.defaultLocation}
                placeholder="Country, Region or City"
                method={updateLocation}
              />
              <h2 className="font-bold text-2xl">Sensors</h2>
              <SettingCard name="Accelerometer" setting="accelerometer" initial={Boolean(settings.accelerometer)} />
              <SettingCard name="Ambient Light" setting="ambient" initial={Boolean(settings.ambient)} />
              <SettingCard name="Gesture Sensor" setting="gesture" initial={Boolean(settings.gesture)} />
              <SettingCard name="Proximity Sensor" setting="proximity" initial={Boolean(settings.proximity)} />
            </>
          ) : (
            <h2>Fetching Settings...</h2>
          )}
        </div>
      </div>
    </>
  );
}
