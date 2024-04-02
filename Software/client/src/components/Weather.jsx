import React, { useEffect, useState, useMemo, useContext } from 'react';
import conditions from '../conditions.json';
import './Animations.css';

export default function Weather({ settings }) {
  const APIKey = import.meta.env.VITE_API_KEY;

  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState(settings.defaultLocation);
  const [Svg, setSvg] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showForecast, setShowForecast] = useState(false);

  //Use effect for the weather fetching
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${location}&days=7&aqi=no&alerts=no`,
          {
            mode: 'cors',
          },
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);

        // Check if data is present and has the expected structure
        if (data && data.current && data.current.condition && data.current.condition.code) {
          const conditionObj = conditions.find(item => item.code === data.current.condition.code);
          const svgName = data.current.is_day ? conditionObj.day : conditionObj.night;
          setSvg(`../svgs/${svgName}`);
          setWeather(data);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    // Fetch data immediately after component mounts
    fetchData();

    // Setup interval for fetching data every 5 minutes
    const weatherFetch = setInterval(fetchData, 1000 * 60 * 5);

    return () => clearInterval(weatherFetch);
  }, [location]);

  //Use Effect for the clock and forecast intervals
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const forecastInterval = setInterval(() => {
      setShowForecast(show => !show);
    }, 10000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(forecastInterval);
    };
  }, []);

  return (
    <div className="flex-col m-2 md:col-span-2 font-bold p-3">
      {weather.forecast && weather.current ? (
        <>
          <WeatherDisplay weather={weather} Svg={Svg} currentTime={currentTime} settings={settings} />
          {showForecast ? <Forecast data={weather.forecast} /> : <Stats data={weather} />}
        </>
      ) : (
        <h2>Fetching...</h2>
      )}
    </div>
  );
}

function WeatherDisplay({ weather, Svg, currentTime, settings }) {
  const { location, current } = weather;
  return (
    <>
      <h2 className="text-2xl">
        {location.name}, {location.region}
      </h2>
      <h3 className="text-lg">{location.country}</h3>
      <div className="flex-col">
        <div className="flex items-center">
          <img src={Svg} className="size-40" />
          <div className="flex-col">
            <h2 className="text-6xl" id="current-temp">
              {current.temp_c}°C
            </h2>
            <h2 className="text-4xl" id="condition-text">
              {current.condition.text}
            </h2>
          </div>
        </div>
        <div>
          <h2 className="text-3xl" id="current-time">
            Local Time: {currentTime.toLocaleTimeString(settings.timeFormat, { timeZone: weather.location.tz_id })}
          </h2>
        </div>
      </div>
    </>
  );
}

function Forecast({ data }) {
  return useMemo(() => {
    const { forecastday } = data;
    return (
      <div className="pt-2 fade-in">
        <h2 className="text-2xl font-bold">Forecast</h2>
        <div className="flex gap-3 mt-2 justify-items-start">
          {forecastday.map((value, index) => (
            <ForecastCard key={value.date} info={value} />
          ))}
        </div>
      </div>
    );
  }, [data]);
}

function ForecastCard({ info }) {
  const { date, day } = info;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const svgName = conditions.find(item => item.code == day.condition.code);

  return (
    <div className="flex flex-col items-center pt-2 pb-2 rounded-md bg-zinc-800 w-28 border-2 border-neutral-700">
      <h2 className="font-bold text-sm">{days[new Date(date).getUTCDay()]}</h2>
      <h3 className="text-xs text-center">{day.condition.text}</h3>
      <img src={`/svgs/${svgName.day}`} className="w-16" alt={day.condition.text} />
      <div className="flex justify-between">
        <img src="../svgs/thermometer-warmer.svg" alt="Thermometer warmer" className="w-6 h-6 self-start" />{' '}
        <p className="flex items-center text-sm">{day.maxtemp_c}°C</p>
      </div>
      <div className="flex justify-between">
        <img src="../svgs/thermometer-colder.svg" alt="Thermometer colder" className="w-6 h-6 self-start" />{' '}
        <p className="flex items-center text-sm">{day.mintemp_c}°C</p>
      </div>
    </div>
  );
}

function Statistic({ icon, label, value }) {
  return (
    <div className="flex items-center bg-zinc-800 rounded-md border-2 border-neutral-700">
      <img className="w-12 h-12" src={`../svgs/${icon}.svg`} />
      <p className="text-xs">
        {label}: {value}
      </p>
    </div>
  );
}

function Stats({ data }) {
  return useMemo(() => {
    const { location, current, forecast } = data;

    //Used to calculate the Beaufort wind index
    function Beaufort(kph) {
      if (kph < 1.6) {
        return 0; // Calm
      } else if (kph <= 4.8) {
        return 1; // Light air
      } else if (kph <= 11.3) {
        return 2; // Light breeze
      } else if (kph <= 19.3) {
        return 3; // Gentle breeze
      } else if (kph <= 29) {
        return 4; // Moderate breeze
      } else if (kph <= 38.6) {
        return 5; // Fresh breeze
      } else if (kph <= 49.9) {
        return 6; // Strong breeze
      } else if (kph <= 61.2) {
        return 7; // Near gale
      } else if (kph <= 74.5) {
        return 8; // Gale
      } else if (kph <= 87.9) {
        return 9; // Strong gale
      } else if (kph <= 102.3) {
        return 10; // Storm
      } else if (kph <= 117.4) {
        return 11; // Violent storm
      } else {
        return 12; // Hurricane force
      }
    }

    return (
      <div className="max-w-sm fade-in">
        <h2 className="text-2xl py-2 font-bold">Day Statistics</h2>
        <div className="text-sm md:grid md:grid-cols-3 gap-3">
          <Statistic icon="thermometer-celsius" label="Feels Like" value={`${current.feelslike_c}°C`} />
          <Statistic icon="humidity" label="Humidity" value={`${current.humidity}%`} />
          <Statistic icon="windsock" label="Wind Dir" value={`${current.wind_dir}/${current.wind_degree}°`} />
          <Statistic icon="barometer" label="Pressure" value={`${current.pressure_mb / 10}kPa`} />
          <Statistic icon="raindrop" label="Precip" value={`${current.precip_mm}mm`} />
          <Statistic
            icon={`wind-beaufort-${Beaufort(current.wind_kph)}`}
            label="Wind"
            value={`${current.wind_kph}kph`}
          />
          <Statistic icon="sunrise" label="Sunrise" value={`${forecast.forecastday[0].astro.sunrise}`} />
          <Statistic icon="sunset" label="Sunset" value={`${forecast.forecastday[0].astro.sunset}`} />
          <Statistic icon={`uv-index-${current.uv}`} label="UV Index" value={current.uv} />
        </div>
      </div>
    );
  }, [data]);
}
