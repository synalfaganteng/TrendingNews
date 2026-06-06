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

  // ===== PRIORITAS 1: RELATIVE PARSING =====
  // (harus didahulukan karena Date.parse bisa salah baca "minggu"=Sunday dll)

  // "kemarin" / "yesterday"
  if (/\bkemarin\b|\byesterday\b/.test(s)) return now - 86400000;
  // "hari ini" / "today" / "just now" / "baru saja"
  if (/hari ini|today|just now|baru saja|moments? ago/.test(s)) return now;

  // angka + satuan (cek "minggu/week" SEBELUM yang lain karena "minggu" ambigu)
  const match = s.match(/(\d+)\s*(detik|menit|jam|hari|minggu|bulan|tahun|seconds?|minutes?|hours?|days?|weeks?|months?|years?|mins?|hrs?|secs?)\b/);
  if (match) {
    const num = parseInt(match[1], 10);
    const unit = match[2];
    let ms = 0;
    // Cek dari yang paling spesifik. Pakai ^...$ supaya "min" tidak match "minggu".
    if (/^(minggu|weeks?)$/.test(unit)) ms = num * 7 * 86400000;
    else if (/^(detik|seconds?|secs?)$/.test(unit)) ms = num * 1000;
    else if (/^(menit|minutes?|mins?)$/.test(unit)) ms = num * 60000;
    else if (/^(jam|hours?|hrs?)$/.test(unit)) ms = num * 3600000;
    else if (/^(hari|days?)$/.test(unit)) ms = num * 86400000;
    else if (/^(bulan|months?)$/.test(unit)) ms = num * 30 * 86400000;
    else if (/^(tahun|years?)$/.test(unit)) ms = num * 365 * 86400000;
    return now - ms;
  }

  // ===== PRIORITAS 2: ABSOLUTE DATE (Indonesia) =====
  // Format: "27 Agu 2025", "24 Des 2018", "2 Apr 2026"
  const idMonths = {
    jan: 0, feb: 1, mar: 2, apr: 3, mei: 4, jun: 5,
    jul: 6, agu: 7, agt: 7, sep: 8, okt: 9, nov: 10, des: 11,
  };
  const idMatch = s.match(/(\d{1,2})\s+([a-z]{3})[a-z]*\s+(\d{4})/);
  if (idMatch) {
    const day = parseInt(idMatch[1], 10);
    const monKey = idMatch[2].slice(0, 3);
    const year = parseInt(idMatch[3], 10);
    if (monKey in idMonths) {
      const ts = new Date(year, idMonths[monKey], day).getTime();
      if (!Number.isNaN(ts) && ts <= now + 86400000) return ts;
    }
  }

  // ===== PRIORITAS 3: standar Date.parse (English format) =====
  const absolute = Date.parse(dateStr);
  if (!Number.isNaN(absolute)) {
    if (absolute <= now + 86400000 && now - absolute < 365 * 86400000) {
      return absolute;
    }
  }

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
 * MAIN: cari kandidat berita untuk sebuah judul.
 * HEMAT KUOTA: hanya 1 panggilan (endpoint /news yang sudah ada tanggal).
 * Endpoint /search hanya dipakai kalau /news kosong (jarang).
 */
export async function serpSearchCandidates(title, { allowSearchFallback = false } = {}) {
  if (!isSerperEnabled()) return [];

  const query = title.slice(0, 200);

  // Panggilan utama: /news (1 kredit)
  const newsResults = await serperNews(query);

  // Dedupe
  const byLink = new Map();
  for (const r of newsResults) {
    if (!r.link) continue;
    if (!byLink.has(r.link)) byLink.set(r.link, r);
  }

  // Fallback ke /search HANYA kalau /news kosong & diizinkan (hemat kuota)
  if (byLink.size === 0 && allowSearchFallback) {
    const searchResults = await serperSearch(query);
    for (const r of searchResults) {
      if (!r.link) continue;
      if (!byLink.has(r.link)) byLink.set(r.link, r);
    }
  }

  return [...byLink.values()];
}
