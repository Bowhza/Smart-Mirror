import { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import SettingsContext from '../contexts/SettingsContext';

export default function ClientSettings() {
  const { settings, setSettings, loading } = useContext(SettingsContext);

  return (
    <>
      <Header title="Settings" />
      <div className="flex flex-col flex-grow p-3 gap-3">
        <h2 className="font-bold text-2xl">Sensors</h2>
        <div className="flex flex-col gap-3">
          {!loading ? (
            <>
              <Card name="Accelerometer" setting="accelerometer" initial={Boolean(settings.accelerometer)} />
              <Card name="Ambient Light" setting="ambient" initial={Boolean(settings.ambient)} />
              <Card name="Gesture Sensor" setting="gesture" initial={Boolean(settings.gesture)} />
              <Card name="Proximity Sensor" setting="proximity" initial={Boolean(settings.proximity)} />
            </>
          ) : (
            <h2>Fetching Settings...</h2>
          )}
        </div>
      </div>
    </>
  );
}
