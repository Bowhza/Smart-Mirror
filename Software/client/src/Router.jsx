import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import { useEffect, useState } from 'react';

const Router = () => {
  const [ip, setIp] = useState('');
  const hostIP = import.meta.env.VITE_HOST;

  useEffect(() => {
    fetch(`http://${hostIP}:5174/get_ip`, { mode: 'cors' })
      .then(res => res.json())
      .then(data => {
        setIp(data.ip);
        console.log(data.ip);
      })
      .catch(error => console.log(error));
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: ip === hostIP ? <App /> : <h1 className="text-neutral-100">Not Host Device</h1>,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
