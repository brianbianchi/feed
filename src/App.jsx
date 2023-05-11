import { useCallback, useEffect, useState } from "react";
import { List, ListFeed } from "./List";
import { feeds } from "./data/feeds";
import { getFeedData } from "./data/helper";

function App() {
  const [pages, setPages] = useState([]);
  const [subs, setSubs] = useState([]);
  const [recommended, setRecommended] = useState(feeds);
  const [error, setError] = useState(null);

  const addSub = useCallback((item) => {
    setSubs((prevSubs) => [...prevSubs, item]);
    setRecommended((prevRecommended) => prevRecommended.filter((obj) => obj.title !== item.title));
  }, []);

  const removeSub = useCallback((item) => {
    setRecommended((prevRecommended) => [...prevRecommended, item]);
    setSubs((prevSubs) => prevSubs.filter((obj) => obj.title !== item.title));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      if (!subs.length) {
        setPages([]);
        return;
      }

      try {
        const promises = subs.map((sub) => getFeedData(sub.url));
        const feedData = await Promise.all(promises);
        const items = feedData.flat();
        setPages(items);
      } catch (error) {
        setError(error.message);
      }
    }

    fetchData();
    return () => {
      controller.abort();
    };
  }, [subs]);

  return (
    <div>
      <small>
        <a href="https://github.com/brianbianchi/feed" target="_blank" rel="noopener noreferrer">
          Code
        </a>
      </small>
      <h2>Subscriptions</h2>
      <List items={subs} onButtonClick={removeSub} />
      <h2>Recommended</h2>
      <List items={recommended} onButtonClick={addSub} />
      <h2>Feed <small>({pages.length})</small></h2>
      {error && <div>{error}</div>}
      <ListFeed items={pages} />
    </div>
  );
}

export default App;
