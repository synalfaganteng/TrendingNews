/**
 * SERP FINDER — Pencarian mendalam via Serper.dev
 *
 * Mengakses hasil Google Search yang LENGKAP (Top Stories + organic results),
 * jauh lebih luas daripada Google News RSS. Bisa menangkap situs kecil,
 * blog resmi, situs pemerintah, dll.
 *
 * Serper.dev menyediakan:
 * - /news    → Google News results (dengan field "date": "2 hours ago" / "3 days ago")
 * - /search  → Google organic + topStories
 *
 * API key dari env: SERPER_API_KEY
 * Kalau tidak ada → return [] (fallback ke RSS di origin-finder)
 */

const SERPER_NEWS_URL = "https://google.serper.dev/news";
const SERPER_SEARCH_URL = "https://google.serper.dev/search";

export function isSerperEnabled() {
  return !!process.env.SERPER_API_KEY;
}

/**
 * Parse relative date string ke timestamp.
 * Contoh: "2 hours ago", "3 days ago", "16 jam lalu", "kemarin", "1 week ago"
 */
export function parseRelativeDate(dateStr, now = Date.now()) {
  if (!dateStr) return null;
  const s = dateStr.toLowerCase().trim();

  // Coba parse sebagai tanggal absolut dulu (mis. "Jun 4, 2026")
  const absolute = Date.parse(dateStr);
  if (!Number.isNaN(absolute)) {
    // Validasi: tidak di masa depan, tidak lebih dari 1 tahun lalu
    if (absolute <= now + 86400000 && now - absolute < 365 * 86400000) {
      return absolute;
    }
  }

  // Relative parsing
  // angka + satuan
  const match = s.match(/(\d+)\s*(detik|menit|jam|hari|minggu|bulan|second|minute|hour|day|week|month|min|hr|sec)/);
  if (match) {
    const num = parseInt(match[1], 10);
    const unit = match[2];
    let ms = 0;
    if (/detik|second|sec/.test(unit)) ms = num * 1000;
    else if (/menit|minute|min/.test(unit)) ms = num * 60000;
    else if (/jam|hour|hr/.test(unit)) ms = num * 3600000;
    else if (/hari|day/.test(unit)) ms = num * 86400000;
    else if (/minggu|week/.test(unit)) ms = num * 7 * 86400000;
    else if (/bulan|month/.test(unit)) ms = num * 30 * 86400000;
    return now - ms;
  }

  // "kemarin" / "yesterday"
  if (/kemarin|yesterday/.test(s)) return now - 86400000;
  // "hari ini" / "today" / "just now" / "baru saja"
  if (/hari ini|today|just now|baru saja/.test(s)) return now;

  return null;
}

/**
 * Cari di Google News via Serper
 */
async function serperNews(query) {
  const key = process.env.SERPER_API_KEY;
  if (!key) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(SERPER_NEWS_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "id", // Indonesia
        hl: "id", // Bahasa Indonesia
        num: 20,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Serper news error:", res.status);
      return [];
    }

    const data = await res.json();
    const now = Date.now();

    return (data.news || []).map((item) => ({
      title: item.title || "",
      link: item.link || "",
      snippet: item.snippet || "",
      source: item.source || extractDomain(item.link),
      pubDate: parseRelativeDate(item.date, now),
      rawDate: item.date,
    }));
  } catch (err) {
    clearTimeout(timeout);
    return [];
  }
}

/**
 * Cari di Google Search (organic + topStories) via Serper
 */
async function serperSearch(query) {
  const key = process.env.SERPER_API_KEY;
  if (!key) return [];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(SERPER_SEARCH_URL, {
      method: "POST",
      headers: {
        "X-API-KEY": key,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "id",
        hl: "id",
        num: 20,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      console.error("Serper search error:", res.status);
      return [];
    }

    const data = await res.json();
    const now = Date.now();
    const results = [];

    // Top Stories — paling relevan untuk berita
    for (const item of data.topStories || []) {
      results.push({
        title: item.title || "",
        link: item.link || "",
        snippet: item.snippet || "",
        source: item.source || extractDomain(item.link),
        pubDate: parseRelativeDate(item.date, now),
        rawDate: item.date,
      });
    }

    // Organic results — tangkap situs kecil/pemerintah
    for (const item of data.organic || []) {
      results.push({
        title: item.title || "",
        link: item.link || "",
        snippet: item.snippet || "",
        source: extractDomain(item.link),
        pubDate: parseRelativeDate(item.date, now),
        rawDate: item.date,
      });
    }

    return results;
  } catch (err) {
    clearTimeout(timeout);
    return [];
  }
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Unknown";
  }
}

/**
 * MAIN: cari semua kandidat berita untuk sebuah judul.
 * Gabung hasil News + Search, dedupe by link.
 */
export async function serpSearchCandidates(title) {
  if (!isSerperEnabled()) return [];

  // Query: judul utuh (Google handle relevance sendiri)
  const query = title.slice(0, 200);

  const [newsResults, searchResults] = await Promise.all([
    serperNews(query),
    serperSearch(query),
  ]);

  const merged = [...newsResults, ...searchResults];

  // Dedupe by link
  const byLink = new Map();
  for (const r of merged) {
    if (!r.link) continue;
    if (!byLink.has(r.link)) byLink.set(r.link, r);
  }

  return [...byLink.values()];
}
