import { useState, useEffect } from 'react';

import Header from '../components/Header';
import Card from '../components/Card';

export default function ClientSettings() {
  const hostIP = import.meta.env.VITE_HOST;
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(`http://${hostIP}:5174/get_settings`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setSettings(data);
      });
  }, []);

  return (
    <>
      <Header title="Settings" />
      <div className="flex flex-col flex-grow p-3 gap-3 drop-shadow-lg">
        <p className="font-bold text-2xl">Sensors</p>
        <div className="flex flex-col gap-3">
          {settings ? (
            <>
              <Card name="Accelerometer" setting="accelerometer" initial={Boolean(settings.accelerometerPower)} />
              <Card name="Ambient Light" setting="ambient" initial={Boolean(settings.ambientBrightnessAdj)} />
              <Card name="Gesture Sensor" setting="gesture" initial={Boolean(settings.gesturePower)} />
              <Card name="Proximity Sensor" setting="proximity" initial={Boolean(settings.proximityPower)} />
            </>
          ) : (
            <h2>Fetching Settings...</h2>
          )}
        </div>
      </div>
    </>
  );
}
