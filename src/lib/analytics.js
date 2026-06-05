/**
 * Analytics & Spike Detection
 *
 * Menganalisis kumpulan berita untuk mendeteksi:
 * 1. SPIKE — topik yang tiba-tiba banyak diberitakan (banyak portal nulis topik sama)
 * 2. Trending keywords — kata kunci yang sering muncul
 * 3. Distribusi per provinsi, per content type, per platform
 * 4. Hot regions — kota/kabupaten yang lagi banyak diberitakan
 */

const STOPWORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk", "pada",
  "adalah", "akan", "telah", "sudah", "tidak", "bisa", "ada", "juga", "lebih",
  "oleh", "setelah", "saat", "dalam", "karena", "seperti", "kata", "dapat",
  "harus", "mereka", "kami", "kita", "atau", "tapi", "namun", "lalu", "serta",
  "hingga", "sampai", "usai", "pasca", "akibat", "menjadi", "tersebut",
  "secara", "bahwa", "begitu", "sedang", "masih", "lagi", "baru", "saja",
  "seorang", "orang", "warga", "pihak", "sejak", "antara", "sementara",
  "maupun", "agar", "supaya", "jika", "kalau", "sebuah", "suatu", "para",
  "sang", "hal", "demikian", "selain", "ketika", "sebelum", "sesudah",
  "yakni", "yaitu", "akan", "kepada", "tentang", "hari", "tahun", "bulan",
  "soal", "buat", "guna", "bagi", "atas", "bawah", "dia", " nya",
]);

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

/**
 * SPIKE DETECTION
 * Mengelompokkan berita berdasarkan kesamaan keyword.
 * Jika >= 2 portal berbeda menulis topik yang mirip dalam window waktu →
 * itu spike (topik sedang "panas").
 */
export function detectSpikes(items) {
  // Build keyword frequency per cluster
  const clusters = [];

  for (const item of items) {
    const keywords = new Set(
      extractKeywords(`${item.title} ${item.snippet || ""}`)
    );

    // Cari cluster yang cocok (>= 3 keyword sama)
    let matched = null;
    for (const cluster of clusters) {
      let overlap = 0;
      for (const kw of keywords) {
        if (cluster.keywords.has(kw)) overlap++;
      }
      // Threshold: minimal 3 keyword sama ATAU 40% dari keyword item
      if (overlap >= 3 || (keywords.size > 0 && overlap / keywords.size >= 0.4)) {
        matched = cluster;
        break;
      }
    }

    if (matched) {
      matched.items.push(item);
      matched.sources.add(item.source);
      for (const kw of keywords) matched.keywords.add(kw);
    } else {
      clusters.push({
        items: [item],
        sources: new Set([item.source]),
        keywords: new Set(keywords),
      });
    }
  }

  // Spike = cluster dengan >= 2 sumber berbeda
  const spikes = clusters
    .filter((c) => c.sources.size >= 2)
    .map((c) => {
      // Top keywords dalam cluster
      const kwFreq = {};
      for (const item of c.items) {
        for (const kw of extractKeywords(item.title)) {
          kwFreq[kw] = (kwFreq[kw] || 0) + 1;
        }
      }
      const topKeywords = Object.entries(kwFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([kw]) => kw);

      // Representative item = yang viral score tertinggi / paling baru
      const sorted = [...c.items].sort((a, b) => {
        const av = a.viral?.viralScore || 0;
        const bv = b.viral?.viralScore || 0;
        if (bv !== av) return bv - av;
        return (b.pubDate || 0) - (a.pubDate || 0);
      });

      return {
        topic: topKeywords.join(" · "),
        keywords: topKeywords,
        sourceCount: c.sources.size,
        articleCount: c.items.length,
        sources: [...c.sources],
        representative: sorted[0],
        items: sorted,
        // Spike intensity: makin banyak sumber & artikel makin "panas"
        intensity: c.sources.size * 2 + c.items.length,
      };
    })
    .sort((a, b) => b.intensity - a.intensity);

  return spikes;
}

/**
 * Trending keywords across all news
 */
export function getTrendingKeywords(items, limit = 20) {
  const freq = {};
  for (const item of items) {
    const seen = new Set(); // count each keyword once per article
    for (const kw of extractKeywords(item.title)) {
      if (!seen.has(kw)) {
        freq[kw] = (freq[kw] || 0) + 1;
        seen.add(kw);
      }
    }
  }
  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));
}

/**
 * Build full analytics summary
 */
export function buildAnalytics(items) {
  const total = items.length;

  // Per province
  const byProvince = {};
  // Per content type
  const byType = {};
  // Per platform (best platform)
  const byPlatform = {};
  // Per region (kota/kab)
  const byRegion = {};
  // Viral distribution
  const viralDist = { sangat: 0, potensi: 0, cukup: 0, normal: 0 };

  let totalViralScore = 0;
  let highPotentialCount = 0;

  for (const item of items) {
    // Province
    for (const p of item.provinces || []) {
      byProvince[p] = (byProvince[p] || 0) + 1;
    }

    // Region
    for (const r of item.regions || []) {
      byRegion[r] = (byRegion[r] || 0) + 1;
    }

    if (item.viral) {
      totalViralScore += item.viral.viralScore;

      // Type
      const t = item.viral.contentType?.type || "Umum";
      byType[t] = (byType[t] || 0) + 1;

      // Platform
      if (item.viral.bestPlatform) {
        const pl = item.viral.bestPlatform.label;
        byPlatform[pl] = (byPlatform[pl] || 0) + 1;
      }

      // Viral dist
      const s = item.viral.viralScore;
      if (s >= 75) viralDist.sangat++;
      else if (s >= 55) viralDist.potensi++;
      else if (s >= 35) viralDist.cukup++;
      else viralDist.normal++;

      if (s >= 55) highPotentialCount++;
    }
  }

  const sortObj = (obj) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({ key, count }));

  return {
    total,
    avgViralScore: total > 0 ? Math.round(totalViralScore / total) : 0,
    highPotentialCount,
    byProvince: sortObj(byProvince),
    byType: sortObj(byType),
    byPlatform: sortObj(byPlatform),
    hotRegions: sortObj(byRegion).slice(0, 10),
    viralDist,
    trendingKeywords: getTrendingKeywords(items, 15),
  };
}
