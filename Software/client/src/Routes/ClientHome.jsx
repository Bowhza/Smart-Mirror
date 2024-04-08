import { useState, useEffect } from 'react';
import Header from '../components/Header';

export default function ClientHome({ socket }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <>
      <Header title="Home" />
      <div className="flex flex-col flex-grow p-3 gap-2">
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

        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Accelerometer Controls</h2>
          <p>
            <span className="font-bold">Double Tap</span> toggles the display ON/OFF.
          </p>
        </div>

        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Ambient Light Sensor</h2>
          <p>
            <span className="font-bold">If Enabled</span> will automatically adjust the display brightness based on the
            measured light (LUX) level.
          </p>
          <p>
            <span className="font-bold">If Disabled</span> manual override for display brightness is available.
          </p>
        </div>

        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Gesture Controls</h2>
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

        <div className="py-2 px-3 rounded-md border-2 bg-neutral-100 drop-shadow-sm">
          <h2 className="font-bold text-2xl">Proximity Sensor</h2>
          <p>
            <span className="font-bold">If Enabled</span> will turn on the display on detected presence. Will turn off
            automatically if no presence is detected for 5 seconds.
          </p>
        </div>
      </div>
    </>
  );
}
