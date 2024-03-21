import React, { createContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hostIP = import.meta.env.VITE_HOST;
    fetch(`http://${hostIP}:5174/get_settings`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setSettings(data);
        setLoading(false);
      });
  }, []);

  return <SettingsContext.Provider value={{ settings, setSettings, loading }}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
