import { fetchAllNews } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
import { findOriginalsForItems } from "@/src/lib/origin-finder";

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

  // Cari ORIGINAL untuk tiap berita (terpisah, tidak terikat 3 jam)
  if (!skipOrigin && news.length > 0) {
    // Concurrency lebih rendah (4) karena verifikasi AI menambah latensi
    const originals = await findOriginalsForItems(news, 4);
    news = news.map((item, idx) => ({
      ...item,
      originalSource: originals[idx],
      isOriginal: !originals[idx],
    }));
  }

  return Response.json({
    count: news.length,
    lastUpdated: new Date().toISOString(),
    items: news,
  });
}
