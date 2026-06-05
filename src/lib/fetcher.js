import RSSParser from "rss-parser";
import {
  MEDIA_SOURCES,
  GOOGLE_TRENDS_RSS,
  GOOGLE_NEWS_FEEDS,
} from "./sources";
import {
  isRelevantToMappedRegions,
  detectProvinces,
  detectKotaKab,
} from "./region-filter";

const parser = new RSSParser({
  timeout: 6000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; TrendingNews/2.0)",
  },
});

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

async function fetchFeed(url, sourceName, sourceProvince, type = "news", maxAgeMs = THREE_HOURS_MS) {
  try {
    const feed = await parser.parseURL(url);
    const cutoff = Date.now() - maxAgeMs;

    return (feed.items || [])
      .map((item) => {
        const pubDate = item.pubDate
          ? new Date(item.pubDate).getTime()
          : item.isoDate
            ? new Date(item.isoDate).getTime()
            : null;

        const title = item.title || "";
        const snippetRaw =
          item.contentSnippet || item.content || item.description || "";
        const snippet = snippetRaw.replace(/<[^>]+>/g, "").slice(0, 280);

        return {
          title,
          link: item.link || "",
          pubDate,
          source: sourceName,
          sourceProvince,
          type,
          snippet,
        };
      })
      .filter((item) => {
        if (item.pubDate && item.pubDate < cutoff) return false;
        return true;
      });
  } catch {
    return [];
  }
}

// Cache
let dedupCache = null;
let dedupCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

let displayCache = null;
let displayCacheTime = 0;
const DISPLAY_CACHE_TTL = 60 * 1000; // 1 menit

/**
 * Fetch news untuk DISPLAY (3 jam terakhir)
 * Cached 1 menit untuk responsiveness.
 */
export async function fetchAllNews() {
  if (displayCache && Date.now() - displayCacheTime < DISPLAY_CACHE_TTL) {
    return displayCache;
  }

  const promises = [];

  for (const source of MEDIA_SOURCES) {
    promises.push(
      fetchFeed(source.rss, source.name, source.province, "media")
    );
  }

  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(fetchFeed(gn.rss, "Google News", gn.label, "google-news"));
  }

  const results = await Promise.all(promises);
  let items = results.flat();

  // STRICT FILTER: judul/awal snippet harus menyebut wilayah target,
  // dan tidak ada blacklist location
  items = items.filter((item) =>
    isRelevantToMappedRegions(item.title, item.snippet)
  );

  // Dedupe by link
  const seen = new Set();
  items = items.filter((i) => {
    if (!i.link) return true;
    if (seen.has(i.link)) return false;
    seen.add(i.link);
    return true;
  });

  // Enrich
  items = items.map((item) => ({
    ...item,
    provinces: detectProvinces(`${item.title} ${item.snippet}`),
    regions: detectKotaKab(`${item.title} ${item.snippet}`),
  }));

  // Sort by recency
  items.sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0;
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return b.pubDate - a.pubDate;
  });

  displayCache = items;
  displayCacheTime = Date.now();
  return items;
}

/**
 * Pool 7 hari untuk dedup. Cached 5 menit.
 */
export async function fetchDedupPool() {
  if (dedupCache && Date.now() - dedupCacheTime < CACHE_TTL) {
    return dedupCache;
  }

  const promises = [];
  for (const source of MEDIA_SOURCES) {
    promises.push(
      fetchFeed(source.rss, source.name, source.province, "media", SEVEN_DAYS_MS)
    );
  }
  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(
      fetchFeed(gn.rss, "Google News", gn.label, "google-news", SEVEN_DAYS_MS)
    );
  }

  const results = await Promise.all(promises);
  let pool = results.flat();

  pool = pool.filter((item) =>
    isRelevantToMappedRegions(item.title, item.snippet)
  );

  const seen = new Set();
  pool = pool.filter((i) => {
    if (!i.link) return true;
    if (seen.has(i.link)) return false;
    seen.add(i.link);
    return true;
  });

  dedupCache = pool;
  dedupCacheTime = Date.now();
  return pool;
}

/**
 * Google Trends — ONLY for sidebar widget, never mixed with main feed
 */
export async function fetchTrending() {
  return fetchFeed(
    GOOGLE_TRENDS_RSS,
    "Google Trends",
    "Indonesia",
    "trending",
    24 * 60 * 60 * 1000 // 24 jam
  );
}

export async function searchGoogleNewsForOriginal(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=id&gl=ID&ceid=ID:id`;
  return fetchFeed(url, "Google News", "Pencarian", "google-news-search", SEVEN_DAYS_MS);
}
