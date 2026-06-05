import { fetchAllNews } from "@/src/lib/fetcher";
import { rankByViralPotential } from "@/src/lib/viral-scorer";

// Revalidate every 30 seconds (ISR)
export const revalidate = 30;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province"); // filter by province
  const type = searchParams.get("type"); // filter by type: media, google-news, trending
  const sort = searchParams.get("sort") || "viral"; // "viral" or "time"
  const limit = parseInt(searchParams.get("limit") || "100", 10);

  let news = await fetchAllNews();

  // Apply filters
  if (province) {
    news = news.filter(
      (item) => item.province.toLowerCase() === province.toLowerCase()
    );
  }
  if (type) {
    news = news.filter((item) => item.type === type);
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
