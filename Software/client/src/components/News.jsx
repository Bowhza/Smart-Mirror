import { useState, useEffect } from 'react';
import './Animations.css';

export default function News() {
  const [newsItems, setNewsItems] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const parseRSS = rssText => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(rssText, 'text/xml');

        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
          title: item.querySelector('title').textContent,
          link: item.querySelector('link').textContent,
          description: item.querySelector('description').textContent,
          pubDate: item.querySelector('pubDate').textContent.slice(0, -6),
        }));

        return items;
      };

      try {
        // Array of RSS feed URLs from different news sources
        const rssFeeds = [
          'https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009',
          'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
        ];

        // Fetch RSS feeds from multiple sources concurrently
        const responses = await Promise.all(rssFeeds.map(feedUrl => fetch(feedUrl)));

        // Parse each RSS feed and extract news items
        const parsedFeeds = await Promise.all(responses.map(response => response.text()));
        const aggregatedNews = parsedFeeds.flatMap(parseRSS);

        // Update state with aggregated news
        setNewsItems(aggregatedNews);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    //Instantly fetches the news data on render
    fetchNews();

    //Fetches new news data every 10 minutes
    const newsInterval = setInterval(
      () => {
        fetchNews();
      },
      1000 * 60 * 10,
    );

    //Cleanup function
    return () => clearInterval(newsInterval);
  }, []);

  return (
    <div className="md:col-span-7 md:flex w-screen mx-5 mb-5 items-end container">
      <div className="scrolling-container flex gap-5">
        {newsItems ? (
          newsItems.map((article, index) => {
            return <Article key={index} info={article} />;
          })
        ) : (
          <p>Fetching...</p>
        )}
      </div>
    </div>
  );
}

function Article({ info }) {
  return (
    <div
      className="flex-shrink-0 md:w-56 h-48 rounded-md p-3 bg-zinc-800 
    flex-col flex justify-between mt-5 border-2 border-neutral-700"
    >
      <div className="overflow-hidden">
        <h2 className="text-sm font-bold">{info.title}</h2>
        <p className="text-xs  h-16">{info.description}</p>
      </div>
      <p className="text-xs">{info.pubDate}</p>
    </div>
  );
}
