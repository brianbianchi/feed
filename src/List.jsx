import { htmlDecode } from "./data/helper";

export function List({ items, onButtonClick }) {
    if (!items.length) {
      return <small>none.</small>;
    }
  
    return (
      <ul>
        {items.map((item, key) => {
          return (
            <li key={key}>
              <button type="button" className="btn-link" onClick={() => onButtonClick(item)}>
                {item.title}
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  export function ListFeed({ items }) {
    if (!items.length) {
      return;
    }
  
    return (
        <ul>
          {items.map((item, key) => {
            return (
              <li key={key}>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {htmlDecode(item.title)}
                </a>{" "}
                <br />
                {item.feed.title} <br />
                {item.author} {new Date(item.pubDate).toLocaleDateString("en-US")} <hr />
              </li>
            );
          })}
        </ul>
    );
  }