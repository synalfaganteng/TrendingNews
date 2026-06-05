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
      "Mozilla/5.0 (compatible; TrendingSumut/1.0; +https://trending-sumut.vercel.app)",
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

        const title = item.title || "";
        const snippet =
          item.contentSnippet || item.content || item.description || "";
        const fullText = `${title} ${snippet}`;

        return {
          title,
          link: item.link || "",
          pubDate,
          source: sourceName,
          sourceProvince,
          type,
          snippet,
          _fullText: fullText,
        };
      })
      .filter((item) => {
        // Only include items from last 3 hours
        if (item.pubDate && item.pubDate < cutoff) return false;
        return true;
      });
  } catch {
    return [];
  }
}

/**
 * Fetch all sources in parallel, filter to relevant regions only
 */
export async function fetchAllNews() {
  const promises = [];

  // 1. Media sources (all provinces)
  for (const source of MEDIA_SOURCES) {
    promises.push(
      fetchFeed(source.rss, source.name, source.province, "media")
    );
  }

  // 2. Google News regional feeds
  for (const gn of GOOGLE_NEWS_FEEDS) {
    promises.push(
      fetchFeed(gn.rss, "Google News", gn.label, "google-news")
    );
  }

  // 3. Google Trends (national)
  promises.push(
    fetchFeed(GOOGLE_TRENDS_RSS, "Google Trends", "Indonesia", "trending")
  );

  const results = await Promise.all(promises);
  let allItems = results.flat();

  /**
   * FILTER UTAMA:
   * SEMUA berita harus menyebut wilayah yang sudah dipetakan.
   * Portal Sumut yang publish berita Lombok → BUANG.
   * Portal Aceh yang publish berita Jakarta → BUANG.
   */
  allItems = allItems.filter((item) =>
    isRelevantToMappedRegions(item._fullText)
  );

  // Enrich with detected province & kota/kab
  allItems = allItems.map(({ _fullText, ...rest }) => ({
    ...rest,
    provinces: detectProvinces(_fullText),
    regions: detectKotaKab(_fullText),
  }));

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
 * Get Google Trends data (national, unfiltered — for sidebar)
 */
export async function fetchTrending() {
  const items = await fetchFeed(
    GOOGLE_TRENDS_RSS,
    "Google Trends",
    "Indonesia",
    "trending"
  );
  return items.map(({ _fullText, ...rest }) => rest);
}
