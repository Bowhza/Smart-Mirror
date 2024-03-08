import { useEffect, useState } from 'react';

export default function Weather() {
  const APIKey = import.meta.env.VITE_API_KEY;
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState('Edmonton');

  useEffect(() => {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${location}&days=7&aqi=no&alerts=no`, {
      mode: 'cors',
    })
      .then(res => res.json())
      .then(data => setWeather(data));
  });

  return (
    <div className="p-1 border-2 m-2 border-neutral-900">
      {weather.current ? (
        <>
          <h2>
            {weather.location.name}, {weather.location.region}
          </h2>
          <h3>{weather.location.country}</h3>
          <div className="flex-col">
            <div className="flex">
              <img />
              <div className="flex-col">
                <h2 id="current-temp">{weather.current.temp_c} °C</h2>
                <h2 id="condition-text">{weather.current.condition.text}</h2>
              </div>
            </div>
            <div>
              <h2 id="current-time">{weather.location.localtime}</h2>
            </div>
          </div>
        </>
      ) : (
        <h2>Fetching...</h2>
      )}
    </div>
  );
}
