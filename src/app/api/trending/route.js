import { fetchTrending } from "@/src/lib/fetcher";

export const revalidate = 60;

export async function GET() {
  const trends = await fetchTrending();

  return Response.json({
    count: trends.length,
    lastUpdated: new Date().toISOString(),
    items: trends,
  });
}
