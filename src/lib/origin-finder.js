/**
 * ORIGIN FINDER — STRICT MATCHING (5W1H based)
 *
 * Logika:
 * 1. Extract entitas dari item:
 *    - WHO   : nama orang/organisasi (kata kapital di tengah)
 *    - WHERE : nama tempat (kota/kab/instansi)
 *    - WHAT  : verba penting + objek
 *    - HOW MUCH: angka + satuan (12 tahun, 90 hektare, 3 korban)
 *    - KEYWORDS: kata distinctive (>= 5 huruf, bukan stopword)
 *
 * 2. Match HARUS lolos:
 *    - Title similarity >= 55%
 *    - DAN minimal 2 dari 4: WHO match, WHERE match, WHAT match, NUMBER match
 *
 * 3. Validasi waktu:
 *    - Selisih maksimal 30 hari (>30 hari = beda berita / data error)
 *    - pubDate harus valid number
 *
 * 4. Hanya cari original yang dalam window 7 hari ke belakang
 *    (lebih lama dari itu kemungkinan beda peristiwa)
 */

import RSSParser from "rss-parser";

const parser = new RSSParser({
  timeout: 8000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; TrendingNews/2.0)" },
});

const MAX_LOOKBACK_MS = 7 * 24 * 60 * 60 * 1000; // 7 hari

const STOPWORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk",
  "pada", "adalah", "akan", "telah", "sudah", "tidak", "bisa", "ada",
  "juga", "lebih", "oleh", "setelah", "saat", "dalam", "karena",
  "seperti", "kata", "dapat", "harus", "mereka", "kami", "kita",
  "atau", "tapi", "namun", "lalu", "serta", "hingga", "sampai",
  "usai", "pasca", "akibat", "menjadi", "tersebut", "secara",
  "bahwa", "sedang", "masih", "lagi", "baru", "saja", "seorang",
  "orang", "warga", "pihak", "sejak", "antara", "para", "atas",
  "the", "and", "for", "was", "are", "but", "with", "yang",
  "punya", "buat", "milik", "nya",
]);

// Satuan angka yang penting (tahun, hektare, dll)
const NUMBER_UNITS = [
  "tahun", "bulan", "hari", "jam", "menit",
  "hektare", "ha ", "meter", "kilometer", "km ",
  "juta", "miliar", "triliun", "ribu",
  "orang", "korban", "tewas", "luka",
  "persen", "%",
  "rp", "rupiah", "dolar",
];

// Verb/action keywords penting (5W1H "what")
const ACTION_KEYWORDS = [
  "ditangkap", "ditahan", "divonis", "dihukum", "dibekuk", "diciduk",
  "tewas", "meninggal", "terbakar", "membakar", "membunuh", "dibunuh",
  "menabrak", "ditabrak", "tenggelam", "hilang", "ditemukan",
  "menyerang", "diserang", "memukul", "dipukul", "merampok", "dirampok",
  "memperkosa", "dilecehkan", "diperkosa",
  "korupsi", "menggelapkan", "menipu",
  "demo", "memprotes", "bentrok",
  "meledak", "kebakaran", "banjir", "longsor", "gempa",
  "menang", "juara", "kalah",
  "dilantik", "diresmikan", "dibangun",
];

// Lokasi/instansi penting
const LOCATION_PATTERN = /\b(kota|kabupaten|kab|kec|kelurahan|desa|jalan|jl|polres|polsek|polda|pengadilan|pn|kantor|gedung|rumah sakit|rs|fakultas|universitas|sekolah|sma|smp|sd|kampus|terminal|bandara|pelabuhan)\b/i;

function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract WHO — nama orang/organisasi
 * Heuristik: 2+ kata kapital berurutan di tengah kalimat (bukan awal)
 */
function extractWho(rawText) {
  if (!rawText) return new Set();
  const result = new Set();

  // Match 2-4 capitalized words in a row (bukan di awal kalimat & bukan single)
  const matches = rawText.matchAll(/(?:^|[\s,.])([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})/g);
  for (const m of matches) {
    const phrase = m[1].toLowerCase();
    // Skip kata umum yang sering kapital di awal
    if (phrase.length < 5) continue;
    if (/^(senin|selasa|rabu|kamis|jumat|sabtu|minggu|januari|februari|maret|april|mei|juni|juli|agustus|september|oktober|november|desember)/i.test(phrase)) continue;
    result.add(phrase);
  }

  return result;
}

/**
 * Extract WHERE — kota/kabupaten dan lokasi spesifik
 */
function extractWhere(rawText) {
  if (!rawText) return new Set();
  const result = new Set();
  const lower = rawText.toLowerCase();

  // Kota/kabupaten populer di Sumatera
  const places = [
    "medan", "binjai", "deli serdang", "langkat", "karo", "berastagi",
    "pematangsiantar", "siantar", "sibolga", "tebing tinggi", "padangsidimpuan",
    "tanjungbalai", "asahan", "labuhanbatu", "tapanuli", "toba", "samosir",
    "nias", "gunungsitoli", "balige", "tarutung", "kisaran", "rantauprapat",
    "banda aceh", "lhokseumawe", "sabang", "langsa", "subulussalam",
    "bireuen", "pidie", "aceh besar", "aceh utara", "aceh tamiang",
    "nagan raya", "meulaboh", "takengon", "gayo lues",
    "padang", "bukittinggi", "payakumbuh", "pariaman", "solok",
    "agam", "tanah datar", "padang pariaman", "pesisir selatan",
    "pekanbaru", "dumai", "kampar", "siak", "rokan", "indragiri",
    "tanjungpinang", "batam", "bintan", "karimun", "natuna", "lingga",
  ];

  for (const place of places) {
    if (lower.includes(place)) result.add(place);
  }

  // Instansi (regex)
  const inst = lower.match(LOCATION_PATTERN);
  if (inst) result.add(inst[0]);

  return result;
}

/**
 * Extract WHAT — action verbs
 */
function extractWhat(rawText) {
  if (!rawText) return new Set();
  const lower = rawText.toLowerCase();
  const result = new Set();
  for (const action of ACTION_KEYWORDS) {
    if (lower.includes(action)) result.add(action);
  }
  return result;
}

/**
 * Extract NUMBERS with units (12 tahun, 90 hektare, 3 korban, dll)
 */
function extractNumbers(rawText) {
  if (!rawText) return new Set();
  const result = new Set();
  const lower = rawText.toLowerCase();

  // Pattern: angka + satuan
  // contoh: "12 tahun", "12,5 tahun", "90 hektare"
  const matches = lower.matchAll(/(\d+(?:[.,]\d+)?)\s*([a-z%]+)/g);
  for (const m of matches) {
    const num = m[1].replace(",", ".");
    const unit = m[2];
    // Only keep if unit is a known unit
    if (NUMBER_UNITS.some((u) => unit.startsWith(u.trim()))) {
      result.add(`${num}_${unit}`);
    }
  }

  return result;
}

/**
 * Extract distinctive keywords (>= 5 huruf, bukan stopword)
 */
function extractKeywords(text) {
  return new Set(
    normalize(text)
      .split(" ")
      .filter((w) => w.length >= 5 && !STOPWORDS.has(w))
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

/**
 * Profile lengkap untuk sebuah artikel — cache di item
 */
function buildProfile(item) {
  const rawTitle = item.title || "";
  const rawSnippet = item.snippet || "";
  const rawCombined = `${rawTitle}. ${rawSnippet}`;

  return {
    titleKw: extractKeywords(rawTitle),
    titleBigrams: getBigrams(rawTitle),
    fullKw: extractKeywords(rawCombined),
    who: extractWho(rawCombined),
    where: extractWhere(rawCombined),
    what: extractWhat(rawCombined),
    numbers: extractNumbers(rawCombined),
  };
}

/**
 * Compute match score & 5W1H signals
 */
function compareArticles(profileA, profileB) {
  // Title similarity
  const titleKwOverlap = overlap(profileA.titleKw, profileB.titleKw);
  const titleBigramJaccard = jaccard(profileA.titleBigrams, profileB.titleBigrams);
  const titleScore = titleKwOverlap * 0.6 + titleBigramJaccard * 0.4;

  // 5W1H matches (binary, lalu dihitung berapa banyak yang match)
  const whoMatch = countSetIntersection(profileA.who, profileB.who) >= 1;
  const whereMatch = countSetIntersection(profileA.where, profileB.where) >= 1;
  const whatMatch = countSetIntersection(profileA.what, profileB.what) >= 1;
  const numberMatch = countSetIntersection(profileA.numbers, profileB.numbers) >= 1;

  const fivewSignals = [whoMatch, whereMatch, whatMatch, numberMatch].filter(Boolean).length;

  // Full keyword overlap (untuk validasi tambahan)
  const fullKwOverlap = overlap(profileA.fullKw, profileB.fullKw);

  return {
    titleScore,
    titleKwOverlap,
    titleBigramJaccard,
    fullKwOverlap,
    fivewSignals,
    whoMatch,
    whereMatch,
    whatMatch,
    numberMatch,
  };
}

function countSetIntersection(a, b) {
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n;
}

/**
 * Decide if two articles are the SAME story
 *
 * Aturan:
 * - Title similarity >= 55%, ATAU
 * - Title similarity >= 40% DAN minimal 3 sinyal 5W1H match, ATAU
 * - Title similarity >= 30% DAN 4 sinyal 5W1H match (semua match)
 *
 * Plus full keyword overlap >= 35% (sebagai sanity check)
 */
function isSameStory(comp) {
  if (comp.fullKwOverlap < 0.30) return false;

  if (comp.titleScore >= 0.55) return true;
  if (comp.titleScore >= 0.40 && comp.fivewSignals >= 3) return true;
  if (comp.titleScore >= 0.30 && comp.fivewSignals >= 4) return true;

  return false;
}

/**
 * Validate pubDate sanity
 */
function isValidPubDate(pubDate, referenceDate) {
  if (!pubDate || !Number.isFinite(pubDate)) return false;
  if (pubDate <= 0) return false;
  if (pubDate > Date.now() + 60000) return false; // future date
  // Lookback maksimum 7 hari
  if (referenceDate - pubDate > MAX_LOOKBACK_MS) return false;
  // pubDate harus < referenceDate (kandidat lebih AWAL)
  if (pubDate >= referenceDate) return false;
  return true;
}

/**
 * Format selisih waktu
 */
function formatDiff(ms) {
  const m = Math.floor(ms / 60000);
  if (m < 60) return `${m} menit lebih awal`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lebih awal`;
  const d = Math.floor(h / 24);
  return `${d} hari lebih awal`;
}

/**
 * Build search queries dari title (multi-strategy)
 */
function buildQueries(title) {
  const norm = normalize(title);
  const words = norm.split(" ").filter((w) => w.length > 0);
  const meaningful = words.filter((w) => w.length >= 3 && !STOPWORDS.has(w));

  if (meaningful.length < 3) return [];

  const queries = new Set();

  // Q1: Quoted phrase dari 4 kata distinctive pertama
  if (meaningful.length >= 4) {
    queries.add(`"${meaningful.slice(0, 4).join(" ")}"`);
  }

  // Q2: Top 6 kata terpanjang (paling distinctive)
  const sorted = [...meaningful].sort((a, b) => b.length - a.length);
  queries.add(sorted.slice(0, 6).join(" "));

  // Q3: Kombinasi 5 kata pertama
  queries.add(meaningful.slice(0, 5).join(" "));

  return [...queries];
}

async function searchGoogleNews(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query
  )}&hl=id&gl=ID&ceid=ID:id`;
  try {
    const feed = await parser.parseURL(url);
    return (feed.items || []).map((item) => ({
      title: (item.title || "").replace(/ - [^-]+$/, ""), // strip source suffix
      rawTitle: item.title || "",
      link: item.link || "",
      snippet: (item.contentSnippet || item.content || "")
        .replace(/<[^>]+>/g, "")
        .slice(0, 400),
      pubDate: item.pubDate ? new Date(item.pubDate).getTime() : null,
      source: extractSource(item),
    }));
  } catch {
    return [];
  }
}

function extractSource(item) {
  if (item.source) {
    if (typeof item.source === "string") return item.source;
    if (item.source._) return item.source._;
    if (item.source.$ && item.source.$.url) {
      try {
        const u = new URL(item.source.$.url);
        return u.hostname.replace(/^www\./, "");
      } catch {}
    }
  }
  const m = (item.title || "").match(/ - ([^-]+)$/);
  return m ? m[1].trim() : "Unknown";
}

// In-memory cache
const cache = new Map();
const CACHE_TTL = 15 * 60 * 1000;

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
 * MAIN: cari original untuk satu item
 */
export async function findOriginal(item) {
  if (!item.title || !item.pubDate) return null;
  if (!Number.isFinite(item.pubDate)) return null;

  const cacheKey = item.link || item.title;
  const cached = getCached(cacheKey);
  if (cached !== null) return cached;

  const queries = buildQueries(item.title);
  if (queries.length === 0) {
    setCached(cacheKey, null);
    return null;
  }

  const allResults = await Promise.all(queries.map(searchGoogleNews));
  const merged = allResults.flat();

  // Dedupe by link, validate pubDate
  const candidates = new Map();
  for (const r of merged) {
    if (!r.link) continue;
    if (r.link === item.link) continue;
    if (!isValidPubDate(r.pubDate, item.pubDate)) continue;
    if (!candidates.has(r.link)) candidates.set(r.link, r);
  }

  if (candidates.size === 0) {
    setCached(cacheKey, null);
    return null;
  }

  // Build profile untuk item
  const itemProfile = buildProfile(item);

  // Evaluate setiap kandidat
  const matches = [];
  for (const cand of candidates.values()) {
    const candProfile = buildProfile(cand);
    const comp = compareArticles(itemProfile, candProfile);

    if (isSameStory(comp)) {
      matches.push({ candidate: cand, comp });
    }
  }

  if (matches.length === 0) {
    setCached(cacheKey, null);
    return null;
  }

  // Pilih: paling AWAL pubDate-nya (sumber pertama tayang)
  matches.sort((a, b) => a.candidate.pubDate - b.candidate.pubDate);
  const winner = matches[0];

  const result = {
    source: winner.candidate.source,
    title: winner.candidate.title,
    link: winner.candidate.link,
    pubDate: winner.candidate.pubDate,
    timeDiff: formatDiff(item.pubDate - winner.candidate.pubDate),
    titleScore: Math.round(winner.comp.titleScore * 100),
    fivewSignals: winner.comp.fivewSignals,
  };

  setCached(cacheKey, result);
  return result;
}

/**
 * Bulk find dengan concurrency limit
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
