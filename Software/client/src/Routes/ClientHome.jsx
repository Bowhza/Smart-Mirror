import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function ClientHome({ socket }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // Event handler for socket connection
    function onConnect() {
      setIsConnected(true);
    }

    // Event handler for socket disconnection
    function onDisconnect() {
      setIsConnected(false);
    }

    // Attach event listeners for socket connection and disconnection
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Cleanup event listeners on component unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <>
      {/* Header component */}
      <Header title="Home" />

      {/* Main content */}
      <div className="flex flex-col flex-grow p-3 gap-2 pb-24">
        {/* Connection status */}
        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Connection</h2>
          <p className="text-xl">
            Socket Status:{' '}
            {isConnected ? (
              <span className="text-green-500 font-bold">Connected</span>
            ) : (
              <span className="text-red-500 font-bold">Disconnected</span>
            )}
          </p>
        </div>

        {/* Accelerometer */}
        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Accelerometer</h2>
          <p>
            <span className="font-bold">If Enabled, Double Tap</span> toggles the display ON/OFF.
          </p>
        </div>

        {/* Ambient Light Sensor */}
        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Ambient Light Sensor</h2>
          <p>
            <span className="font-bold">If Enabled</span> will automatically adjust the display brightness based on the
            measured light (LUX) level.
          </p>
          <p>
            <span className="font-bold">If Disabled</span> the brightness percentage value in the settings tab is used.
          </p>
        </div>

        {/* Gesture Sensor */}
        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Gesture Sensor</h2>
          <p>If the gesture sensor is enabled:</p>
          <p>
            <span className="font-bold">Wave</span> toggles the display ON/OFF.
          </p>
          <p>
            <span className="font-bold">Swipe UP</span> scrolls up on the reminders.
          </p>
          <p>
            <span className="font-bold">Swipe DOWN</span> scrolls down on the reminders.
          </p>
          <p>
            <span className="font-bold">Swipe LEFT</span> toggles pause on the news feed.
          </p>
        </div>

        {/* Proximity Sensor */}
        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Proximity Sensor</h2>
          <p>
            <span className="font-bold">If Enabled</span> will turn on the display on detected presence. Will turn off
            automatically if no presence is detected for 5 seconds.
          </p>
        </div>

        {/* Credits */}
        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Credits</h2>
          <p>
            Tab Icons:{' '}
            <a
              className="font-bold text-blue-500"
              href="https://react-icons.github.io/react-icons/"
              target="_blank"
              rel="noreferrer"
            >
              react-icons
            </a>
          </p>
          <p>
            Weather Icons:{' '}
            <a
              className="font-bold text-blue-500"
              href="https://github.com/basmilius/weather-icons"
              target="_blank"
              rel="noreferrer"
            >
              Meteocons
            </a>
          </p>
          <p>
            Weather API:{' '}
            <a className="font-bold text-blue-500" href="https://www.weatherapi.com/" target="_blank" rel="noreferrer">
              weatherapi.com
            </a>
          </p>
          <p className="font-bold">Developed by Bohdan Bohnat, Keiren Lawrence 2024</p>
        </div>
      </div>
    </>
  );
}
