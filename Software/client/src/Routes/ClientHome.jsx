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
      <div className="flex-col flex-grow p-3">
        <h2 className="text-xl">
          Socket Status:{' '}
          {isConnected ? (
            <span className="text-green-500 font-bold">Connected</span>
          ) : (
            <span className="text-red-500 font-bold">Disconnected</span>
          )}
        </h2>
      </div>
    </>
  );
}
