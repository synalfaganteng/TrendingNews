import RSSParser from "rss-parser";
import {
  MEDIA_SOURCES,
  GOOGLE_TRENDS_RSS,
  GOOGLE_NEWS_FEEDS,
  ALL_REGIONS,
  SUMUT_KEYWORDS,
} from "./sources";

const parser = new RSSParser({
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; TrendingSumut/1.0; +https://trending-sumut.vercel.app)",
  },
});

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

/**
 * Detect which kota/kabupaten Sumut is mentioned in the text
 */
function detectRegions(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return ALL_REGIONS.filter((region) =>
    lower.includes(region.toLowerCase())
  );
}

/**
 * Check if a news item is relevant to Sumatera Utara
 * Returns true if the text mentions any Sumut keyword
 */
function isRelevantToSumut(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SUMUT_KEYWORDS.some((keyword) =>
    lower.includes(keyword.toLowerCase())
  );
}

/**
 * Parse RSS feed items, filter to last 3 hours, normalize format
 */
async function fetchFeed(url, sourceName, province, type = "news") {
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

        const title = item.title || "";
        const snippet =
          item.contentSnippet || item.content || item.description || "";
        const fullText = `${title} ${snippet}`;
        const regions = detectRegions(fullText);

        return {
          title,
          link: item.link || "",
          pubDate,
          source: sourceName,
          province,
          type,
          snippet,
          regions,
          _fullText: fullText, // internal, for filtering
        };
      })
      .filter((item) => {
        // Only include items from last 3 hours
        if (item.pubDate && item.pubDate < cutoff) return false;
        return true;
      });
  } catch {
    // Silently skip feeds that fail
    return [];
  }
}

/**
 * Fetch all sources in parallel, filter to Sumut-relevant only
 */
export async function fetchAllNews() {
  const promises = [];

  // 1. Media sources (all provinces)
  for (const source of MEDIA_SOURCES) {
    promises.push(
      fetchFeed(source.rss, source.name, source.province, "media")
    );
  }

  // 2. Google News regional feeds (already Sumut-focused)
  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(
      fetchFeed(gn.rss, "Google News", "Sumatera Utara", "google-news")
    );
  }

  // 3. Google Trends (national, will be filtered)
  promises.push(
    fetchFeed(GOOGLE_TRENDS_RSS, "Google Trends", "Indonesia", "trending")
  );

  const results = await Promise.all(promises);
  let allItems = results.flat();

  /**
   * FILTER LOGIC:
   * - Portal Sumatera Utara → auto-lolos (semua beritanya relevan)
   * - Portal provinsi lain (Aceh, Sumbar, Riau, Kepri) → hanya lolos
   *   jika menyebut kota/kabupaten Sumut di judul/konten
   * - Google News → sudah di-query "Sumatera Utara", auto-lolos
   * - Google Trends → hanya lolos jika mention Sumut
   */
  allItems = allItems.filter((item) => {
    // Portal Sumut & Google News Sumut → auto-lolos
    if (item.province === "Sumatera Utara") return true;

    // Portal lain & Google Trends → harus mention Sumut
    return isRelevantToSumut(item._fullText);
  });

  // Remove internal field
  allItems = allItems.map(({ _fullText, ...rest }) => rest);

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
 * Get just Google Trends data (filtered to Sumut-relevant)
 */
export async function fetchTrending() {
  const items = await fetchFeed(
    GOOGLE_TRENDS_RSS,
    "Google Trends",
    "Indonesia",
    "trending"
  );
  // For trending, show all (national interest) but mark Sumut-relevant
  return items.map(({ _fullText, ...rest }) => rest);
}
