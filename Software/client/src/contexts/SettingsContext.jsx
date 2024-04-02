import React, { createContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);

  const fetchSettings = () => {
    const hostIP = import.meta.env.VITE_HOST;
    fetch(`http://${hostIP}:5174/get_settings`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }
        return res.json();
      })
      .then(data => {
        setSettings(data);
      })
      .catch(error => {
        console.error('Error fetching settings:', error);
      });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, fetchSettings }}>{children}</SettingsContext.Provider>
  );
};

export default SettingsContext;
