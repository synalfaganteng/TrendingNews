import { fetchAllNews } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
import { buildAnalytics, detectSpikes } from "@/src/lib/analytics";

export const revalidate = 60;

export async function GET() {
  let news = await fetchAllNews();
  news = attachViralScores(news);

  const analytics = buildAnalytics(news);
  const spikes = detectSpikes(news).slice(0, 8);

  return Response.json({
    lastUpdated: new Date().toISOString(),
    analytics,
    spikes,
  });
}
