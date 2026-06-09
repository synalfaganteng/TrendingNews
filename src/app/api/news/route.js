import { fetchAllNews } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
import { findOriginalsForItems } from "@/src/lib/origin-finder";
import { generateFeedInsights } from "@/src/lib/feed-ai";

export const revalidate = 60;
export const maxDuration = 60;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const province = searchParams.get("province");
  const region = searchParams.get("region");
  const sort = searchParams.get("sort") || "viral";
  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const skipOrigin = searchParams.get("skipOrigin") === "true";
  // Ambang skor minimal untuk cari sumber asli (hemat kuota Serper).
  // Default 30 — berita di bawah ini tidak dicari originalnya agar hemat kuota Serper.
  const originMinScore = parseInt(searchParams.get("originMinScore") || "30", 10);

  // Fetch DISPLAY items only (3 jam max — strict)
  let news = await fetchAllNews();
  news = attachViralScores(news);

  // Filter sebelum origin search supaya gak buang waktu cari original
  // untuk berita yang akan di-filter out
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

  // Sort dulu, baru limit, baru cari origin (biar gak sia-sia)
  if (sort === "viral") {
    news.sort((a, b) => (b.viral?.viralScore || 0) - (a.viral?.viralScore || 0));
  } else {
    news.sort((a, b) => (b.pubDate || 0) - (a.pubDate || 0));
  }

  news = news.slice(0, limit);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Send whitespace immediately to bypass Vercel 10s execution limit
      controller.enqueue(encoder.encode(" "));

      try {
        let feedInsights = null;

        if (!skipOrigin && news.length > 0) {
          const targets = news.filter(
            (item) => (item.viral?.viralScore || 0) >= originMinScore
          );

          // Run both AI insights and Origin Search concurrently
          const [originals, insights] = await Promise.all([
            targets.length > 0 ? findOriginalsForItems(targets, 4) : Promise.resolve([]),
            generateFeedInsights(news, sort)
          ]);

          feedInsights = insights;

          if (targets.length > 0 && originals.length > 0) {
            const originByLink = new Map();
            targets.forEach((item, idx) => {
              originByLink.set(item.link, originals[idx]);
            });

            news = news.map((item) => {
              if (originByLink.has(item.link)) {
                const orig = originByLink.get(item.link);
                return { ...item, originalSource: orig, isOriginal: !orig };
              }
              return { ...item, originalSource: null, isOriginal: null };
            });
          }

          if (feedInsights && feedInsights.reasons) {
            news = news.map((item) => {
              if (feedInsights.reasons[item.link]) {
                return { ...item, aiReason: feedInsights.reasons[item.link] };
              }
              return item;
            });
          }
        }

        controller.enqueue(encoder.encode(JSON.stringify({
          count: news.length,
          lastUpdated: new Date().toISOString(),
          feedSummary: feedInsights?.summary || null,
          items: news,
        })));
      } catch (err) {
        console.error("News API Error:", err);
        controller.enqueue(encoder.encode(JSON.stringify({ error: "Internal Server Error" })));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    },
  });
}
