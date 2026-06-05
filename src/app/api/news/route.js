import { fetchAllNews, fetchDedupPool } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
import { detectDuplicates } from "@/src/lib/dedup";

export const revalidate = 30;
export const maxDuration = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province");
  const region = searchParams.get("region");
  const sort = searchParams.get("sort") || "viral";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  const [displayItems, dedupPool] = await Promise.all([
    fetchAllNews(),
    fetchDedupPool(),
  ]);

  let news = attachViralScores(displayItems);

  // Dedup tanpa Google search default (terlalu berat untuk realtime)
  // Bisa diaktifkan via ?deepSearch=true
  const deepSearch = searchParams.get("deepSearch") === "true";
  news = await detectDuplicates(news, dedupPool, deepSearch);

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

  if (sort === "viral") {
    news.sort((a, b) => (b.viral?.viralScore || 0) - (a.viral?.viralScore || 0));
  } else {
    news.sort((a, b) => (b.pubDate || 0) - (a.pubDate || 0));
  }

  news = news.slice(0, limit);

  return Response.json({
    count: news.length,
    lastUpdated: new Date().toISOString(),
    items: news,
  });
}
