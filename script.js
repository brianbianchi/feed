const apiEndpoint = 'https://api.rss2json.com/v1/api.json?rss_url=';
const localStorageKey = "bbfeedsubs";
const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
const recommended = [
    "https://www.reddit.com/.rss",
    "https://www.reddit.com/r/programming/.rss",
    "https://www.reddit.com/r/ProgrammerHumor/.rss",
    "https://news.ycombinator.com/rss",
    "https://feeds.feedburner.com/MeltingAsphalt",
    "https://levels.io/rss/",
    "https://bakadesuyo.com/feed/",
    "https://waitbutwhy.com/feed",
    "https://openai.com/blog/rss/",
    "https://nitter.net/naval/rss",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCtinbF-Q-fVthA0qrFQTgXQ"
];

subs.forEach(url => subscribe(url, null));

recommended.forEach(url => {
    if (!subs.includes(url)) displayFeed(url)
});

function addCustomRssUrl() {
    const urlInput = document.getElementById('rssUrl');
    const rssUrl = urlInput.value.trim();

    if (rssUrl) {
        displayFeed(rssUrl);
        urlInput.value = '';
    }
}

function createRssItem(rssUrl, isSubscribed) {
    const rssItem = document.createElement('li');
    rssItem.className = 'rss-item';
    rssItem.innerHTML = `
        <span>${rssUrl}</span>
        ${isSubscribed ?
            `<button onclick="fetchArticles('${rssUrl}')">Get Articles</button>
            <button onclick="unsubscribe('${rssUrl}', this)">Unsubscribe</button>` :
            `<button onclick="subscribe('${rssUrl}', this)">Subscribe</button>`}
    `;
    return rssItem;
}

function displayFeed(url) {
    const rssItem = createRssItem(url, false);
    document.getElementById('recommendedList').appendChild(rssItem);
}

function subscribe(url, button) {
    if (button) {
        const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const newSubs = [...subs, url];
        localStorage.setItem(localStorageKey, JSON.stringify(newSubs));

        const recommendedList = document.getElementById('recommendedList');
        recommendedList.removeChild(button.parentElement);
    }

    const rssItem = createRssItem(url, true);
    document.getElementById('subscriptionList').appendChild(rssItem);
    const warning = document.getElementById('noSubs');
    if (warning.style.display === '' || warning.style.display === 'block') {
        warning.style.display = 'none';
    }
}

function unsubscribe(url, button) {
    const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const newSubs = subs.filter((sub) => sub !== url);
    localStorage.setItem(localStorageKey, JSON.stringify(newSubs));

    const subscriptionList = document.getElementById('subscriptionList');
    subscriptionList.removeChild(button.parentElement);
}

async function fetchArticles(rssUrl) {
    try {
        const response = await fetch(`${apiEndpoint}${rssUrl}`);
        const data = await response.json();
        if (response.status === 422) {
            console.error('Error fetching articles:', data.message);
            return;
        }
        displayArticles(data);
    } catch (error) {
        console.error(error);
    }
}

function displayArticles(res) {
    const articlesDiv = document.getElementById('articles');
    if (!articlesDiv.innerHTML) {
        articlesDiv.innerHTML += `<h2 onclick="toggleContent(this)">Articles</h2>
                                    <ul id="articleList"></ul>`;
    }

    res.items.forEach(article => {
        const articleItem = createArticleItem(article, res.feed.title)
        document.getElementById('articleList').appendChild(articleItem);
    });
}

function createArticleItem(article, title) {
    const articleItem = document.createElement('li');
    articleItem.className = 'article';
    articleItem.innerHTML = `
        <a href="${article.link}" target="_blank" rel="noopener noreferrer">${article.title}</a>
        <br />
        ${title} <br />
        ${article.author} ${new Date(article.pubDate).toLocaleDateString("en-US")} <hr />
    `;
    return articleItem;
}

function toggleContent(header) {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}