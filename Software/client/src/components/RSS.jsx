export default function RSS() {
  const [newsItems, setNewsItems] = useState([]);

  const fetchNews = async () => {
    const parseRSS = rssText => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rssText, 'text/xml');

      const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
        pubDate: item.querySelector('pubDate').textContent,
      }));

      return items;
    };

    try {
      // Array of RSS feed URLs from different news sources
      const rssFeeds = [
        'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
        'https://www.ctvnews.ca/rss/ctvnews-ca-top-stories-public-rss-1.822009',
      ];

      // Fetch RSS feeds from multiple sources concurrently
      const responses = await Promise.all(rssFeeds.map(feedUrl => fetch(feedUrl)));

      // Parse each RSS feed and extract news items
      const parsedFeeds = await Promise.all(responses.map(response => response.text()));
      const aggregatedNews = parsedFeeds.flatMap(parseRSS);

      // Update state with aggregated news
      setNewsItems(aggregatedNews);
      console.log(aggregatedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return <div></div>;
}
