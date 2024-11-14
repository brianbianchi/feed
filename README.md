> Create a curated list of the latest articles from your favorite blogs.

## Workflow
```mermaid
sequenceDiagram
    User->>Web: View 
    Web<<->>Browser local storage: Get subscriptions
    Web<<->>rss2json: Get latest articles from proxy service
    Web->>Web: Sort articles by date
    Web->>Web: Display articles
    alt
        User->>Web: Subscribe to new feed 
        Web->>Browser local storage: Add subscription
        Web<<->>rss2json: Get latest articles from proxy service
        Web->>Web: Sort articles by date
        Web->>Web: Display new articles
    end
    alt
        User->>Web: Unsubscribe from feed 
        Web->>Browser local storage: Remove subscription
        Web->>Web: Remove articles
    end
```

## Contribute
New RSS URL recommendations are welcome [here](https://github.com/brianbianchi/feed/blob/master/script.js).