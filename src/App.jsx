import { useCallback, useEffect, useState } from "react";
import { List, ListFeed } from "./List";
import { feeds } from "./data/feeds";
import { getFeedData } from "./data/helper";

function App() {
  const localStorageKey = "bbfeedsubs";

  const [pages, setPages] = useState([]);
  const [subs, setSubs] = useState(JSON.parse(localStorage.getItem(localStorageKey)) ?? []);
  const [recommended, setRecommended] = useState(() => {
    if (subs.length === 0) {
      return feeds;
    }
    return feeds.filter((rec) => !subs.some((sub) => sub.title === rec.title));
  });
  const [error, setError] = useState(null);

  const addSub = (item) => {
    const newSubs = [...subs, item];
    setSubs(newSubs);
    localStorage.setItem(localStorageKey, JSON.stringify(newSubs));
    setRecommended((prevRecommended) => prevRecommended.filter((obj) => obj.title !== item.title));
  };

  const removeSub = (item) => {
    setRecommended((prevRecommended) => [...prevRecommended, item]);
    const newSubs = subs.filter((obj) => obj.title !== item.title);
    setSubs(newSubs);
    localStorage.setItem(localStorageKey, JSON.stringify(newSubs));
  };

  useEffect(() => {
    const controller = new AbortController();
    async function fetchData() {
      if (!subs.length) {
        if (pages.length > 0) {
          setPages([]);
        }
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
