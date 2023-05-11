/**
 * Decodes HTML string. (&qot; -> ")
 * @param {string} input 
 * @returns decoded string
 */
export function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
};

export async function getFeedData(url) {
  const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
  const { items, feed } = await response.json();
  return items.map((item) => ({ ...item, feed }));
}