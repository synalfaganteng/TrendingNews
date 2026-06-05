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
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; TrendingNews/2.0; +https://trendingnews.vercel.app)",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["ht:approx_traffic", "approxTraffic"],
      ["ht:news_item", "newsItems", { keepArray: true }],
      ["enclosure", "enclosure"],
    ],
  },
});

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Extract image URL from various RSS formats
 */
function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  if (item.mediaContent?.[0]?.$?.url) return item.mediaContent[0].$.url;
  const content = item.content || item["content:encoded"] || "";
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  if (match) return match[1];
  return null;
}

/**
 * Parse RSS feed items, with configurable max age
 */
async function fetchFeed(url, sourceName, sourceProvince, type = "news", maxAgeMs = THREE_HOURS_MS) {
  try {
    const feed = await parser.parseURL(url);
    const now = Date.now();
    const cutoff = now - maxAgeMs;

    return (feed.items || [])
      .map((item) => {
        const pubDate = item.pubDate
          ? new Date(item.pubDate).getTime()
          : item.isoDate
            ? new Date(item.isoDate).getTime()
            : null;

        const title = item.title || "";
        const snippet =
          item.contentSnippet || item.content || item.description || "";
        const fullText = `${title} ${snippet}`;

        let trafficVolume = null;
        if (item.approxTraffic) trafficVolume = item.approxTraffic;

        return {
          title,
          link: item.link || "",
          pubDate,
          source: sourceName,
          sourceProvince,
          type,
          snippet: snippet.replace(/<[^>]+>/g, "").slice(0, 300),
          image: extractImage(item),
          trafficVolume,
          _fullText: fullText,
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

// Cache untuk extended pool — refresh tiap 5 menit
let extendedCache = null;
let extendedCacheTime = 0;
const EXTENDED_CACHE_TTL = 5 * 60 * 1000;

/**
 * Extended pool — 7 hari dari semua portal media (untuk dedup)
 * Dicache supaya tidak fetch ulang setiap request.
 */
async function fetchExtendedPool() {
  if (extendedCache && Date.now() - extendedCacheTime < EXTENDED_CACHE_TTL) {
    return extendedCache;
  }

  const promises = [];
  for (const source of MEDIA_SOURCES) {
    promises.push(
      fetchFeed(source.rss, source.name, source.province, "media", SEVEN_DAYS_MS)
    );
  }

  // Plus Google News feeds (juga 7 hari)
  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(
      fetchFeed(gn.rss, "Google News", gn.label, "google-news", SEVEN_DAYS_MS)
    );
  }

  const results = await Promise.all(promises);
  let pool = results.flat();

  // Filter relevan Sumut/Aceh/Sumbar/Riau/Kepri
  pool = pool.filter((item) => isRelevantToMappedRegions(item._fullText));

  // Dedupe by link
  const seen = new Set();
  pool = pool.filter((item) => {
    if (!item.link) return true;
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });

  extendedCache = pool;
  extendedCacheTime = Date.now();
  return pool;
}

/**
 * Search Google News by title query — untuk cari original source
 * dari portal yang TIDAK ada di daftar kita.
 */
export async function searchGoogleNewsForOriginal(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=id&gl=ID&ceid=ID:id`;
  // 7 hari window
  return fetchFeed(url, "Google News", "Pencarian", "google-news-search", SEVEN_DAYS_MS);
}

/**
 * Fetch news untuk DISPLAY (3 jam terakhir)
 */
export async function fetchAllNews() {
  const promises = [];

  for (const source of MEDIA_SOURCES) {
    promises.push(
      fetchFeed(source.rss, source.name, source.province, "media")
    );
  }

  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(fetchFeed(gn.rss, "Google News", gn.label, "google-news"));
  }

  promises.push(
    fetchFeed(GOOGLE_TRENDS_RSS, "Google Trends", "Indonesia", "trending")
  );

  const results = await Promise.all(promises);
  let allItems = results.flat();

  allItems = allItems.filter((item) =>
    isRelevantToMappedRegions(item._fullText)
  );

  // Dedupe by link
  const seen = new Set();
  allItems = allItems.filter((item) => {
    if (!item.link) return true;
    if (seen.has(item.link)) return false;
    seen.add(item.link);
    return true;
  });

  allItems = allItems.map(({ _fullText, ...rest }) => ({
    ...rest,
    provinces: detectProvinces(_fullText),
    regions: detectKotaKab(_fullText),
  }));

  allItems.sort((a, b) => {
    if (!a.pubDate && !b.pubDate) return 0;
    if (!a.pubDate) return 1;
    if (!b.pubDate) return -1;
    return b.pubDate - a.pubDate;
  });

  return allItems;
}

/**
 * Extended pool untuk dedup — 7 hari, semua portal + Google News
 */
export async function fetchDedupPool() {
  const pool = await fetchExtendedPool();
  return pool.map(({ _fullText, ...rest }) => ({
    ...rest,
    provinces: detectProvinces(_fullText),
    regions: detectKotaKab(_fullText),
  }));
}

export async function fetchTrending() {
  const items = await fetchFeed(
    GOOGLE_TRENDS_RSS,
    "Google Trends",
    "Indonesia",
    "trending"
  );
  return items.map(({ _fullText, ...rest }) => rest);
}

export async function fetchGoogleNewsQuery(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=id&gl=ID&ceid=ID:id`;
  const items = await fetchFeed(url, "Google News", query, "google-news");
  return items.map(({ _fullText, ...rest }) => rest);
}
