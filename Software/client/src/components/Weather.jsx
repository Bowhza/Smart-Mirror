import { useEffect, useState } from 'react';
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
        setSvg(`../public/svgs/${svgName}`);
      });

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex-col m-2 md:col-span-2 font-bold p-3">
      <div>
        {weather.current ? (
          <>
            <h2 className="text-2xl">
              {weather.location.name}, {weather.location.region}
            </h2>
            <h3 className="text-lg">{weather.location.country}</h3>
            <div className="flex-col">
              <div className="flex items-center">
                <img src={Svg} className="size-40" />
                <div className="flex-col">
                  <h2 className="text-6xl" id="current-temp">
                    {weather.current.temp_c}°C
                  </h2>
                  <h2 className="text-4xl" id="condition-text">
                    {weather.current.condition.text}
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
        ) : (
          <h2>Fetching...</h2>
        )}
      </div>
      {weather.forecast && <Forecast data={weather.forecast} />}
    </div>
  );
}

function Forecast({ data }) {
  const [forecast, setForecast] = useState(data);
  return (
    <div className="flex flex-col pt-2">
      <h2 className="text-2xl font-bold">Forecast</h2>
      <div className="flex mt-2 gap-5">
        {Object.entries(forecast.forecastday).map(([key, value]) => {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const svgName = conditions.find(item => item.code == value.day.condition.code);

          return (
            <div key={key} className="flex flex-col items-center p-2 rounded-md bg-zinc-800 w-48">
              <h2 className="text-lg font-semibold">{days[new Date(value.date).getUTCDay()]}</h2>
              <img src={`/svgs/${svgName.day}`} className="w-13 h-13" />
              <div className="flex justify-between">
                <img src="../svgs/thermometer-warmer.svg" className="w-10 h-10 self-start" />
                <p className="flex items-center">{value.day.maxtemp_c}°C</p>
              </div>
              <div className="flex justify-between">
                <img src="../svgs/thermometer-colder.svg" className="w-10 h-10 self-start" />
                <p className="flex items-center">{value.day.mintemp_c}°C</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
