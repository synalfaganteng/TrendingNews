import { fetchAllNews, fetchDedupPool } from "@/src/lib/fetcher";
import { rankByViralPotential, attachViralScores } from "@/src/lib/viral-scorer";
import { detectDuplicates } from "@/src/lib/dedup";

export const revalidate = 30;
export const maxDuration = 60; // izinkan dedup search lebih lama

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const province = searchParams.get("province");
  const region = searchParams.get("region");
  const platform = searchParams.get("platform");
  const minScore = parseInt(searchParams.get("minScore") || "0", 10);
  const sort = searchParams.get("sort") || "viral";
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const deepSearch = searchParams.get("deepSearch") === "true"; // Google News fallback

  // Fetch display items (3 jam) + dedup pool (7 hari) parallel
  const [displayItems, dedupPool] = await Promise.all([
    fetchAllNews(),
    fetchDedupPool(),
  ]);

  let news = attachViralScores(displayItems);

  // Dedup with extended pool
  news = await detectDuplicates(news, dedupPool, deepSearch);

  // Filters
  if (type) news = news.filter((item) => item.type === type);
  if (province) {
    news = news.filter((item) =>
      item.provinces.some((p) => p.toLowerCase() === province.toLowerCase())
    );
  }
  if (region) {
    news = news.filter((item) =>
      item.regions.some((r) => r.toLowerCase() === region.toLowerCase())
    );
  }
  if (platform) {
    news = news.filter((item) =>
      item.viral?.platforms?.some((p) => p.platform === platform)
    );
  }
  if (minScore > 0) {
    news = news.filter((item) => (item.viral?.viralScore || 0) >= minScore);
  }

  // Sort
  if (sort === "viral") {
    news.sort((a, b) => (b.viral?.viralScore || 0) - (a.viral?.viralScore || 0));
  } else if (sort === "reach") {
    news.sort(
      (a, b) =>
        (b.viral?.reach?.estimated || 0) - (a.viral?.reach?.estimated || 0)
    );
  } else {
    news.sort((a, b) => (b.pubDate || 0) - (a.pubDate || 0));
  }

  news = news.slice(0, limit);

  return Response.json({
    count: news.length,
    poolSize: dedupPool.length,
    lastUpdated: new Date().toISOString(),
    sort,
    items: news,
  });
}
