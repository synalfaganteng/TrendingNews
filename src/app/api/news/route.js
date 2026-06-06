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
  // Ambang skor minimal untuk cari sumber asli (hemat kuota Serper).
  // Default 50 — berita di bawah ini tidak dicari originalnya.
  const originMinScore = parseInt(searchParams.get("originMinScore") || "50", 10);

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

  // Cari ORIGINAL hanya untuk berita berpotensi (skor >= originMinScore).
  // Ini menghemat kuota Serper drastis — berita biasa tidak dicari originalnya.
  if (!skipOrigin && news.length > 0) {
    const targets = news.filter(
      (item) => (item.viral?.viralScore || 0) >= originMinScore
    );

    if (targets.length > 0) {
      const originals = await findOriginalsForItems(targets, 4);
      // Map hasil balik ke item berdasarkan link
      const originByLink = new Map();
      targets.forEach((item, idx) => {
        originByLink.set(item.link, originals[idx]);
      });

      news = news.map((item) => {
        if (originByLink.has(item.link)) {
          const orig = originByLink.get(item.link);
          return { ...item, originalSource: orig, isOriginal: !orig };
        }
        // Berita skor rendah: tidak dicari, status original tidak diketahui
        return { ...item, originalSource: null, isOriginal: null };
      });
    }
  }

  return Response.json({
    count: news.length,
    lastUpdated: new Date().toISOString(),
    items: news,
  });
}
