import React, { useEffect, useState } from 'react';
import conditions from '../conditions.json';

export default function Weather() {
  const APIKey = import.meta.env.VITE_API_KEY;
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState('Edmonton');
  const [Svg, setSvg] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${location}&days=7&aqi=no&alerts=no`, {
      mode: 'cors',
    })
      .then(res => res.json())
      .then(async data => {
        console.log(data);
        setWeather(data);

        const conditionObj = conditions.find(item => item.code == data.current.condition.code);
        const svgName = data.current.is_day ? conditionObj.day : conditionObj.night;
        setSvg(`../svgs/${svgName}`);
      });

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex-col m-2 md:col-span-2 font-bold p-3">
      {weather.forecast ? (
        <>
          <WeatherDisplay weather={weather} Svg={Svg} currentTime={currentTime} />
          <Forecast data={weather.forecast} />
        </>
      ) : null}
    </div>
  );
}

function WeatherDisplay({ weather, Svg, currentTime }) {
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
            Local Time: {currentTime.toLocaleTimeString()}
          </h2>
        </div>
      </div>
    </>
  );
}

function Forecast({ data }) {
  const { forecastday } = data;
  return (
    <div className="pt-2">
      <h2 className="text-2xl font-bold">Forecast</h2>
      <div className="flex gap-5 mt-2 justify-items-start">
        {forecastday.map((value, index) => (
          <ForecastCard key={value.date} info={value} />
        ))}
      </div>
    </div>
  );
}

function ForecastCard({ info }) {
  const { date, day } = info;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const svgName = conditions.find(item => item.code == day.condition.code);

  return (
    <div className="flex flex-col items-center pt-2 pb-2 rounded-md bg-zinc-800 w-32">
      <h2 className="font-bold">{days[new Date(date).getUTCDay()]}</h2>
      {/*<h3 className="text-lg font-semibold">{day.condition.text}</h3>*/}
      <img src={`/svgs/${svgName.day}`} className="w-2/4" alt={day.condition.text} />
      <div className="flex justify-between">
        <img src="../svgs/thermometer-warmer.svg" alt="Thermometer warmer" className="w-10 h-10 self-start" />
        <p className="flex items-center">{day.maxtemp_c}°C</p>
      </div>
      <div className="flex justify-between">
        <img src="../svgs/thermometer-colder.svg" alt="Thermometer colder" className="w-10 h-10 self-start" />
        <p className="flex items-center">{day.mintemp_c}°C</p>
      </div>
    </div>
  );
}
