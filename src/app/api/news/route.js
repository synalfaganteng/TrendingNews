import { fetchAllNews } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
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
          // Hanya jalankan DeepSeek AI untuk summary (Sangat Hemat Waktu & Kuota)
          feedInsights = await generateFeedInsights(news, sort);

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
