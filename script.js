const apiEndpoint = 'https://api.rss2json.com/v1/api.json?rss_url=';
const localStorageKey = "bbfeedsubs";
const recommended = [
    "https://www.reddit.com/.rss",
    "https://www.reddit.com/r/programming/.rss",
    "https://www.reddit.com/r/ProgrammerHumor/.rss",
    "https://levels.io/rss/",
    "https://bakadesuyo.com/feed/",
    "https://waitbutwhy.com/feed",
    "https://feeds.feedblitz.com/sethsblog&x=1",
    "https://news.ycombinator.com/rss",
    "https://feeds.feedburner.com/MeltingAsphalt",
    "https://openai.com/blog/rss/",
    "https://css-tricks.com/feed/",
    "https://dev.to/feed/",
    "https://blog.logrocket.com/feed/",
    "https://rachelbythebay.com/w/atom.xml",
    "https://web.dev/feed.xml",
    "https://netflixtechblog.com/feed",
    "https://alistapart.com/main/feed/",
    "https://blog.codinghorror.com/rss/",
    "https://fs.blog/blog/feed/",
    "http://www.aaronsw.com/2002/feeds/pgessays.rss",
    "https://www.joelonsoftware.com/feed/",
    "https://lethain.com/feeds.xml",
    "https://staffeng.com/rss",
    "https://blog.samaltman.com/posts.atom"
];
let articles = []

const init = async () => {
    const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    for (const url of subs) {
        document.getElementById('subscriptionList')
            .appendChild(createRssItem(url, true));
        toggleSubWarning(subs);
        await fetchArticles(url);
    }
    articles.sort((a, b) => new Date(a.date) - new Date(b.date));
    displayArticles();

    for (const url of recommended) {
        if (!subs.includes(url)) {
            document.getElementById('recommendedList')
                .appendChild(createRssItem(url, false));
        }
    }
}
init();

// ----------------- HTML -----------------

async function addCustomRssUrl() {
    const urlInput = document.getElementById('rssUrl');
    const url = urlInput.value.trim();

    if (url) {
        document.getElementById('subscriptionList')
            .appendChild(createRssItem(url, true));
        urlInput.value = '';

        const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const newSubs = [...subs, url];
        localStorage.setItem(localStorageKey, JSON.stringify(newSubs));
        toggleSubWarning(newSubs);
        await fetchArticles(url);
        articles.sort((a, b) => new Date(a.date) - new Date(b.date));
        displayArticles();
    }
}

async function subscribe(url, button) {
    const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const newSubs = [...subs, url];
    localStorage.setItem(localStorageKey, JSON.stringify(newSubs));

    document.getElementById('recommendedList')
        .removeChild(button.parentElement);

    document.getElementById('subscriptionList')
        .appendChild(createRssItem(url, true));
    toggleSubWarning(newSubs);

    await fetchArticles(url);
    articles.sort((a, b) => new Date(a.date) - new Date(b.date));
    displayArticles();
}

function unsubscribe(url, button) {
    const subs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const newSubs = subs.filter((sub) => sub !== url);
    localStorage.setItem(localStorageKey, JSON.stringify(newSubs));

    document.getElementById('subscriptionList').removeChild(button.parentElement);
    toggleSubWarning(newSubs);

    articles = articles.filter((article) => article.feedUrl !== url);
    document.getElementById('articles').innerHTML = '';
    displayArticles();
}

function toggleContent(header) {
    const content = header.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

// ----------------- Helper -----------------

function createRssItem(rssUrl, isSubscribed) {
    const rssItem = document.createElement('li');
    rssItem.className = 'rss-item';
    rssItem.innerHTML = `
        <span>${rssUrl}</span>
        ${isSubscribed ?
            `<button onclick="unsubscribe('${rssUrl}', this)">Unsubscribe</button>` :
            `<button onclick="subscribe('${rssUrl}', this)">Subscribe</button>`}
    `;
    return rssItem;
}

async function fetchArticles(rssUrl) {
    try {
        const response = await fetch(`${apiEndpoint}${rssUrl}`);
        const data = await response.json();
        if (response.status === 422) {
            console.error('Error fetching articles:', data.message);
            return;
        }
        const feedUrl = data.feed.url;
        const feedLink = data.feed.link;
        const feedTitle = data.feed.title;
        data.items.forEach(article => {
            if (!isWithinLast7Days(article.pubDate)) return;
            articles.push({
                feedLink,
                feedUrl,
                feedTitle,
                author: article.author,
                date: new Date(article.pubDate),
                link: article.link,
                title: article.title
            })
        });
    } catch (error) {
        console.error(error);
    }
}

function displayArticles() {
    const articlesDiv = document.getElementById('articles');
    if (articles.length && !articlesDiv.innerHTML) {
        articlesDiv.innerHTML += `<h2 onclick="toggleContent(this)">Articles &#11021;</h2>
                                    <ul id="articleList"></ul>`;
    }
    articles.forEach(article => {
        document.getElementById('articleList')
            .appendChild(createArticleItem(article));
    });
}

function createArticleItem(article) {
    const articleItem = document.createElement('li');
    articleItem.className = 'article';
    articleItem.innerHTML = `
        <a href="${article.link}" target="_blank" rel="noopener noreferrer">${article.title}</a>
        <br />
        <a href="${article.feedLink}" target="_blank" rel="noopener noreferrer">${article.feedTitle}</a>
        <br />
        ${article.author} ${new Date(article.date).toLocaleDateString("en-US")} <hr />
    `;
    return articleItem;
}

function toggleSubWarning(subs) {
    const warning = document.getElementById('noSubs');
    warning.style.display = subs.length ? 'none' : 'block';
}

function isWithinLast7Days(date) {
    const currentDate = new Date();
    const sevenDaysAgo = new Date().setDate(currentDate.getDate() - 7);
    const inputDate = new Date(date);
    return inputDate >= sevenDaysAgo && inputDate <= currentDate;
}