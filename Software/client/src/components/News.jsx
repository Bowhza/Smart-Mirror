import { useState, useRef, useEffect } from 'react';

export default function News() {
  const [data, setData] = useState(null);
  const isDataLoaded = useRef(false);

  useEffect(() => {
    const APIKEY = import.meta.env.VITE_NEWS_KEY;
    const fetchData = async () => {
      try {
        // Check if data is already loaded from local storage
        const storedData = localStorage.getItem('myData');
        console.log('Stored data:', JSON.parse(storedData));
        if (storedData) {
          setData(JSON.parse(storedData));
          isDataLoaded.current = true;
          console.log('Data loaded from local storage:', storedData);
          return;
        }

        // Fetch data if not already loaded
        const response = await fetch(
          `https://newsdata.io/api/1/news?apikey=${APIKEY}&category=top&language=en&country=ca&image=1`,
          {
            mode: 'cors',
          },
        );
        const jsonData = await response.json();
        console.log('Fetched data:', jsonData);
        setData(jsonData);
        isDataLoaded.current = true;

        // Store data in local storage
        localStorage.setItem('myData', JSON.stringify(jsonData));
        console.log('Data saved to local storage:', jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data only if it hasn't been loaded yet
    if (!isDataLoaded.current) {
      fetchData();
    }
    console.log(data);
  }, [data]);

  return (
    <div
      className="md:col-span-7 md:flex flex-grow gap-5 snap-x snap-center overflow-hidden 
    scrollbar-hidden mx-5 mb-5 items-end "
    >
      {data && data.results ? (
        data.results.map((article, index) => {
          return <Article key={index} info={article} />;
        })
      ) : (
        <p>Fetching...</p>
      )}
    </div>
  );
}

function Article({ info }) {
  return (
    <div className="flex-shrink-0 md:w-56 h-48 rounded-md p-3 bg-zinc-800 flex-col flex justify-between mt-5 border-2 border-neutral-700">
      <div>
        <h2 className="text-sm font-bold">{info.title}</h2>
        <h3 className="text-xs">{info.creator ? info.creator : 'No Author'}</h3>
      </div>
      <div>
        <img className="w-24" src={info.image_url} alt="News Article Image" />
      </div>
    </div>
  );
}
