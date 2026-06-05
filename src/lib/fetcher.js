/**
 * FETCHER — STRICTLY 3 JAM TERAKHIR
 *
 * File ini HANYA untuk display feed.
 * Untuk pencarian sumber asli (yang bisa berhari-hari lalu), lihat origin-finder.js
 */

import RSSParser from "rss-parser";
import { MEDIA_SOURCES, GOOGLE_NEWS_FEEDS, GOOGLE_TRENDS_RSS } from "./sources";
import {
  isRelevantToMappedRegions,
  detectProvinces,
  detectKotaKab,
} from "./region-filter";

const parser = new RSSParser({
  timeout: 6000,
  headers: {
    "User-Agent": "Mozilla/5.0 (compatible; TrendingNews/2.0)",
  },
});

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

async function fetchFeed(url, sourceName, sourceProvince, type = "news") {
  try {
    const feed = await parser.parseURL(url);
    const cutoff = Date.now() - THREE_HOURS_MS;

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
        // STRICT: 3 jam max
        if (item.pubDate && item.pubDate < cutoff) return false;
        return true;
      });
  } catch {
    return [];
  }
}

// Cache 1 menit untuk responsif tapi tidak ngebanjiri portal
let displayCache = null;
let displayCacheTime = 0;
const CACHE_TTL = 60 * 1000;

/**
 * Display feed — STRICTLY 3 jam terakhir
 */
export async function fetchAllNews() {
  if (displayCache && Date.now() - displayCacheTime < CACHE_TTL) {
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

  items = items.filter((item) =>
    isRelevantToMappedRegions(item.title, item.snippet)
  );

  const seen = new Set();
  items = items.filter((i) => {
    if (!i.link) return true;
    if (seen.has(i.link)) return false;
    seen.add(i.link);
    return true;
  });

  items = items.map((item) => ({
    ...item,
    provinces: detectProvinces(`${item.title} ${item.snippet}`),
    regions: detectKotaKab(`${item.title} ${item.snippet}`),
  }));

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
 * Google Trends widget data — sidebar only
 */
export async function fetchTrending() {
  try {
    const feed = await parser.parseURL(GOOGLE_TRENDS_RSS);
    return (feed.items || []).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      pubDate: item.pubDate ? new Date(item.pubDate).getTime() : null,
    }));
  } catch {
    return [];
  }
}
