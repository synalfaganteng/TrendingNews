import { fetchAllNews } from "@/src/lib/fetcher";
import { rankByViralPotential } from "@/src/lib/viral-scorer";
import { detectDuplicates } from "@/src/lib/dedup";

// Revalidate every 30 seconds (ISR)
export const revalidate = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const province = searchParams.get("province");
  const region = searchParams.get("region");
  const sort = searchParams.get("sort") || "viral";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  let news = await fetchAllNews();

  // Detect duplicates BEFORE filtering (needs full dataset for comparison)
  news = detectDuplicates(news);

  // Apply filters
  if (type) {
    news = news.filter((item) => item.type === type);
  }
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

  // Score and sort
  if (sort === "viral") {
    news = rankByViralPotential(news);
  }

  // Limit results
  news = news.slice(0, limit);

  return Response.json({
    count: news.length,
    lastUpdated: new Date().toISOString(),
    sort,
    items: news,
  });
}
