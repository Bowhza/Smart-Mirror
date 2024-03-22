import React, { createContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = () => {
    const hostIP = import.meta.env.VITE_HOST;
    setLoading(true);
    fetch(`http://${hostIP}:5174/get_settings`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setSettings(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, loading, fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
