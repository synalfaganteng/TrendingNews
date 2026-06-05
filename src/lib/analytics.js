/**
 * Analytics & Spike Detection — Simple
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
  "yakni", "yaitu", "kepada", "tentang", "hari", "tahun", "bulan", "soal",
  "buat", "guna", "bagi", "atas", "bawah", "dia",
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
 * Spike detection — cluster berita topik mirip
 */
export function detectSpikes(items) {
  const clusters = [];

  for (const item of items) {
    const keywords = new Set(
      extractKeywords(`${item.title} ${item.snippet || ""}`)
    );

    let matched = null;
    for (const cluster of clusters) {
      let overlap = 0;
      for (const kw of keywords) if (cluster.keywords.has(kw)) overlap++;
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

  const spikes = clusters
    .filter((c) => c.sources.size >= 2)
    .map((c) => {
      const kwFreq = {};
      for (const item of c.items) {
        for (const kw of extractKeywords(item.title)) {
          kwFreq[kw] = (kwFreq[kw] || 0) + 1;
        }
      }
      const topKeywords = Object.entries(kwFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([kw]) => kw);

      const sorted = [...c.items].sort((a, b) => {
        const av = a.viral?.viralScore || 0;
        const bv = b.viral?.viralScore || 0;
        if (bv !== av) return bv - av;
        return (b.pubDate || 0) - (a.pubDate || 0);
      });

      return {
        keywords: topKeywords,
        sourceCount: c.sources.size,
        articleCount: c.items.length,
        representative: sorted[0],
        intensity: c.sources.size * 2 + c.items.length,
      };
    })
    .sort((a, b) => b.intensity - a.intensity);

  return spikes;
}

export function getTrendingKeywords(items, limit = 15) {
  const freq = {};
  for (const item of items) {
    const seen = new Set();
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

export function buildAnalytics(items) {
  const total = items.length;
  const byProvince = {};
  const byType = {};
  const byRegion = {};
  const viralDist = { sangat: 0, potensi: 0, cukup: 0, normal: 0 };

  let highPotentialCount = 0;

  for (const item of items) {
    for (const p of item.provinces || []) {
      byProvince[p] = (byProvince[p] || 0) + 1;
    }
    for (const r of item.regions || []) {
      byRegion[r] = (byRegion[r] || 0) + 1;
    }

    if (item.viral) {
      const t = item.viral.contentType?.type || "Umum";
      byType[t] = (byType[t] || 0) + 1;

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
    highPotentialCount,
    byProvince: sortObj(byProvince),
    byType: sortObj(byType),
    hotRegions: sortObj(byRegion).slice(0, 10),
    viralDist,
    trendingKeywords: getTrendingKeywords(items, 12),
  };
}
