/**
 * ORIGIN FINDER — Modul TERPISAH dari display feed
 *
 * Tugas: cari berita ASLI (pertama tayang) untuk sebuah berita.
 * - TIDAK ada batas waktu (boleh berjam-jam atau berhari-hari lalu)
 * - Cari via Google News RSS search (mensimulasikan Top Stories + Page 1)
 * - Multi-query strategy: full title + keyword + entity-based
 * - Return: kandidat dengan pubDate paling AWAL
 */

import RSSParser from "rss-parser";

const parser = new RSSParser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; TrendingNews/2.0)" },
});

const STOPWORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk",
  "pada", "adalah", "akan", "telah", "sudah", "tidak", "bisa", "ada",
  "juga", "lebih", "oleh", "setelah", "saat", "dalam", "karena",
  "seperti", "kata", "dapat", "harus", "mereka", "kami", "kita",
  "atau", "tapi", "namun", "lalu", "serta", "hingga", "sampai",
  "usai", "pasca", "akibat", "menjadi", "tersebut", "secara",
  "bahwa", "sedang", "masih", "lagi", "baru", "saja", "seorang",
  "orang", "warga", "pihak", "sejak", "antara", "para", "atas",
  "the", "and", "for", "was", "are", "but", "with",
]);

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  return new Set(
    normalize(text)
      .split(" ")
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  );
}

function getBigrams(text) {
  const words = normalize(text).split(" ");
  const out = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    out.add(`${words[i]} ${words[i + 1]}`);
  }
  return out;
}

function jaccard(a, b) {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

function overlap(a, b) {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / Math.min(a.size, b.size);
}

function similarity(itemA, itemB) {
  const titleKwA = extractKeywords(itemA.title);
  const titleKwB = extractKeywords(itemB.title);
  const fullKwA = extractKeywords(`${itemA.title} ${itemA.snippet || ""}`);
  const fullKwB = extractKeywords(`${itemB.title} ${itemB.snippet || ""}`);
  const bgA = getBigrams(itemA.title);
  const bgB = getBigrams(itemB.title);

  return (
    overlap(titleKwA, titleKwB) * 0.45 +
    overlap(fullKwA, fullKwB) * 0.30 +
    jaccard(bgA, bgB) * 0.25
  );
}

const SIM_THRESHOLD = 0.40;

function formatDiff(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} menit lebih awal`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lebih awal`;
  return `${Math.floor(h / 24)} hari lebih awal`;
}

/**
 * Build multiple search queries from a title.
 * Strategi:
 * 1. Quoted phrase (3-5 kata distinctive berurutan)
 * 2. Top keywords (5-7 kata penting)
 * 3. Entity-focused (nama orang/tempat + verb)
 */
function buildQueries(title) {
  const words = normalize(title).split(" ").filter((w) => w.length > 0);
  const meaningful = words.filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  const queries = [];

  // Q1: Top 5-6 keywords (paling distinctive — kata panjang dulu)
  const sorted = [...meaningful].sort((a, b) => b.length - a.length);
  if (sorted.length >= 3) {
    queries.push(sorted.slice(0, 6).join(" "));
  }

  // Q2: First 4-5 meaningful words (urutan asli — biasanya inti judul)
  if (meaningful.length >= 3) {
    queries.push(meaningful.slice(0, 5).join(" "));
  }

  // Q3: Quoted phrase (3 kata distinctive berurutan dari awal)
  if (sorted.length >= 3) {
    const phrase = meaningful.slice(0, 4).join(" ");
    if (phrase) queries.push(`"${phrase}"`);
  }

  // Dedupe
  return [...new Set(queries)];
}

async function searchGoogleNews(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=id&gl=ID&ceid=ID:id`;
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      snippet: (item.contentSnippet || item.content || "")
        .replace(/<[^>]+>/g, "")
        .slice(0, 300),
      pubDate: item.pubDate ? new Date(item.pubDate).getTime() : null,
      source: extractSourceFromGoogleNews(item.title, item.source),
    }));
  } catch {
    return [];
  }
}

/**
 * Google News title format: "Real Title - Source Name"
 * Atau pakai item.source jika ada
 */
function extractSourceFromGoogleNews(title, sourceField) {
  if (sourceField) {
    if (typeof sourceField === "string") return sourceField;
    if (sourceField._) return sourceField._;
    if (sourceField.$ && sourceField.$.url) {
      try {
        const u = new URL(sourceField.$.url);
        return u.hostname.replace(/^www\./, "");
      } catch {}
    }
  }
  // Fallback: ambil dari title setelah " - "
  const m = title.match(/ - ([^-]+)$/);
  return m ? m[1].trim() : "Unknown";
}

// In-memory cache
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000; // 15 menit

function getCached(key) {
  const c = cache.get(key);
  if (c && Date.now() - c.t < CACHE_TTL) return c.v;
  return null;
}

function setCached(key, v) {
  cache.set(key, { v, t: Date.now() });
  if (cache.size > 300) {
    const oldest = [...cache.entries()]
      .sort((a, b) => a[1].t - b[1].t)
      .slice(0, 100);
    for (const [k] of oldest) cache.delete(k);
  }
}

/**
 * MAIN: cari original source untuk satu item
 */
export async function findOriginal(item) {
  if (!item.title || !item.pubDate) return null;

  const cacheKey = item.link || item.title;
  const cached = getCached(cacheKey);
  if (cached !== null) return cached;

  const queries = buildQueries(item.title);
  if (queries.length === 0) {
    setCached(cacheKey, null);
    return null;
  }

  // Run all queries in parallel
  const allResults = await Promise.all(queries.map(searchGoogleNews));
  const merged = allResults.flat();

  // Dedupe by link
  const byLink = new Map();
  for (const r of merged) {
    if (!r.link) continue;
    if (!byLink.has(r.link)) byLink.set(r.link, r);
  }

  // Cari kandidat yang:
  // - LEBIH AWAL pubDate-nya
  // - Similarity >= threshold
  let best = null;
  let bestSim = 0;

  for (const candidate of byLink.values()) {
    if (!candidate.pubDate) continue;
    if (candidate.pubDate >= item.pubDate) continue;
    if (candidate.link === item.link) continue;

    const sim = similarity(item, candidate);
    if (sim < SIM_THRESHOLD) continue;

    // Pilih: similarity tinggi DAN pubDate paling AWAL
    // Bobot: prioritaskan yang paling AWAL kalau similarity sudah cukup
    if (!best) {
      best = candidate;
      bestSim = sim;
    } else {
      // Jika kandidat ini lebih awal AND similarity masih oke (>=threshold)
      if (candidate.pubDate < best.pubDate) {
        best = candidate;
        bestSim = sim;
      } else if (candidate.pubDate === best.pubDate && sim > bestSim) {
        best = candidate;
        bestSim = sim;
      }
    }
  }

  if (!best) {
    setCached(cacheKey, null);
    return null;
  }

  const result = {
    source: best.source,
    title: best.title.replace(/ - [^-]+$/, ""), // strip " - Source"
    link: best.link,
    pubDate: best.pubDate,
    timeDiff: formatDiff(item.pubDate - best.pubDate),
    similarity: Math.round(bestSim * 100),
  };

  setCached(cacheKey, result);
  return result;
}

/**
 * Concurrency-limited bulk find
 */
export async function findOriginalsForItems(items, concurrency = 6) {
  const results = new Array(items.length);
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const myIdx = idx++;
      try {
        results[myIdx] = await findOriginal(items[myIdx]);
      } catch {
        results[myIdx] = null;
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}
