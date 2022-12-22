import jsonp from "jsonp";
import { useEffect, useRef, useState } from "react";
import { feeds } from "./data/feeds";
import { htmlDecode } from "./data/helper";

function App() {
  const [pages, setPages] = useState([]);
  const [subs, setSubs] = useState([]);
  const [recommended, setRecommended] = useState(feeds);
  const effectRun = useRef(false);

  const addSub = (item) => {
    setSubs(subs.concat(item));
    setRecommended(recommended.filter((obj) => obj.title !== item.title));
  };

  const removeSub = (item) => {
    setRecommended(recommended.concat(item));
    setSubs(subs.filter((obj) => obj.title !== item.title));
  };

  const setFeed = () => {
    if (!subs.length) {
      setPages([]);
    }
    subs.forEach((sub, index) => {
      let url = `https://api.rss2json.com/v1/api.json?callback=JSON_CALLBACK&rss_url=${encodeURIComponent(sub.url)}`;
      console.log({ index, url });
      try {
        jsonp(url, (err, data) => {
          if (err) {
            console.error(err.message);
            return;
          }
          const items = data.items.map((item) => ({ ...item, feed: data.feed }));
          if (index === 0) {
            setPages(items);
            return;
          }
          setPages(pages.concat(items));
        });
      } catch (err) {
        console.log(err);
      }
    });
  };

  useEffect(() => {
    if (!effectRun.current) {
      return () => (effectRun.current = true);
    }
    const controller = new AbortController();
    setFeed();
    return () => {
      controller.abort();
    };
  }, [subs]);

  return (
    <div>
      <h2>Subscriptions</h2>
      {!subs.length ? (
        <small>none.</small>
      ) : (
        subs.map((item, key) => {
          return (
            <li key={key}>
              <button type="button" className="btn-link" onClick={() => removeSub(item)}>
                {item.title}
              </button>
            </li>
          );
        })
      )}
      <h2>Recommended</h2>
      <small>
        <a href="https://github.com/brianbianchi/angularjs-feed/blob/master/src/data/feeds.js" target="_blank">
          (Add here.)
        </a>
      </small>
      <ul>
        {recommended.map((item, key) => {
          return (
            <li key={key}>
              <button type="button" className="btn-link" onClick={() => addSub(item)}>
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
      <h2>
        Feed <small>({pages.length})</small>
      </h2>
      <ul>
        {pages.map((item, key) => {
          return (
            <li key={key}>
              <a href={item.link} target="_blank">
                {htmlDecode(item.title)}
              </a>{" "}
              <br />
              {item.feed.title} <br />
              {item.author} {new Date(item.pubDate).toLocaleDateString("en-US")} <hr />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
