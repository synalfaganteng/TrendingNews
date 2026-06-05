import RSSParser from "rss-parser";
import {
  MEDIA_SOURCES,
  GOOGLE_TRENDS_RSS,
  GOOGLE_NEWS_FEEDS,
} from "./sources";

const parser = new RSSParser({
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; TrendingSumatera/1.0; +https://trending-sumatera.vercel.app)",
  },
});

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

/**
 * Parse RSS feed items, filter to last 3 hours, normalize format
 */
async function fetchFeed(url, sourceName, sourceProvince, type = "news") {
  try {
    const feed = await parser.parseURL(url);
    const now = Date.now();
    const cutoff = now - THREE_HOURS_MS;

    return (feed.items || [])
      .map((item) => {
        const pubDate = item.pubDate
          ? new Date(item.pubDate).getTime()
          : item.isoDate
            ? new Date(item.isoDate).getTime()
            : null;

        return {
          title: item.title || "",
          link: item.link || "",
          pubDate,
          source: sourceName,
          province: sourceProvince,
          type,
          snippet:
            item.contentSnippet || item.content || item.description || "",
        };
      })
      .filter((item) => {
        // Only include items from last 3 hours
        // If no date available, include it (benefit of doubt for fresh feeds)
        if (!item.pubDate) return true;
        return item.pubDate >= cutoff;
      });
  } catch {
    // Silently skip feeds that fail (down, no RSS, timeout)
    return [];
  }
}

/**
 * Fetch all sources in parallel, aggregate and sort by recency
 */
export async function fetchAllNews() {
  const promises = [];

  // 1. Media sources (verified by Dewan Pers)
  for (const source of MEDIA_SOURCES) {
    promises.push(fetchFeed(source.rss, source.name, source.province, "media"));
  }

  // 2. Google News regional feeds
  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(fetchFeed(gn.rss, "Google News", gn.label, "google-news"));
  }

  // 3. Google Trends
  promises.push(
    fetchFeed(GOOGLE_TRENDS_RSS, "Google Trends", "Indonesia", "trending")
  );

  const results = await Promise.all(promises);
  const allItems = results.flat();

  // Sort by publish date descending (newest first)
  allItems.sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0;
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return b.pubDate - a.pubDate;
  });

  return allItems;
}

/**
 * Get just Google Trends data
 */
export async function fetchTrending() {
  return fetchFeed(GOOGLE_TRENDS_RSS, "Google Trends", "Indonesia", "trending");
}
