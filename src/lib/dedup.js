/**
 * Deteksi Berita Duplikat / Rewrite v2
 *
 * Strategi:
 * 1. Bandingkan dengan POOL 7 HARI (semua portal + Google News)
 * 2. Pakai title + content similarity
 * 3. Untuk kandidat top score, lakukan Google News search by title
 *    untuk menangkap portal di luar daftar kita yang publish duluan
 */

import { searchGoogleNewsForOriginal } from "./fetcher";

const STOPWORDS = new Set([
  "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk",
  "pada", "adalah", "akan", "telah", "sudah", "tidak", "bisa", "ada",
  "juga", "lebih", "oleh", "setelah", "saat", "dalam", "karena",
  "seperti", "kata", "dapat", "harus", "mereka", "kami", "kita",
  "atau", "tapi", "namun", "lalu", "serta", "hingga", "sampai",
  "usai", "pasca", "akibat", "menjadi", "tersebut", "secara",
  "bahwa", "begitu", "sedang", "masih", "lagi", "baru", "saja",
  "seorang", "orang", "warga", "pihak", "sejak", "antara",
  "sementara", "maupun", "agar", "supaya", "jika", "kalau",
  "sebuah", "suatu", "para", "sang", "hal", "demikian",
  "selain", "ketika", "sebelum", "sesudah", "yakni", "yaitu",
  "tentang", "hari", "tahun", "bulan", "soal", "buat", "guna",
  "bagi", "atas", "bawah", "dia",
]);

function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text) {
  const normalized = normalize(text);
  if (!normalized) return new Set();
  return new Set(
    normalized.split(" ").filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  );
}

function getBigrams(text) {
  const words = normalize(text).split(" ");
  const bigrams = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) if (setB.has(item)) intersection++;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function overlapCoefficient(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) if (setB.has(item)) intersection++;
  return intersection / Math.min(setA.size, setB.size);
}

function getArticleSimilarity(articleA, articleB) {
  const titleA = articleA.title || "";
  const titleB = articleB.title || "";
  const contentA = articleA.snippet || "";
  const contentB = articleB.snippet || "";

  const titleKwA = extractKeywords(titleA);
  const titleKwB = extractKeywords(titleB);
  const titleKeywordScore = overlapCoefficient(titleKwA, titleKwB);

  const contentKwA = extractKeywords(contentA);
  const contentKwB = extractKeywords(contentB);
  const contentKeywordScore = overlapCoefficient(contentKwA, contentKwB);

  const titleBigramScore = jaccard(getBigrams(titleA), getBigrams(titleB));

  const fullKwA = extractKeywords(`${titleA} ${contentA}`);
  const fullKwB = extractKeywords(`${titleB} ${contentB}`);
  const fullKeywordScore = overlapCoefficient(fullKwA, fullKwB);

  return (
    titleKeywordScore * 0.3 +
    contentKeywordScore * 0.3 +
    fullKeywordScore * 0.25 +
    titleBigramScore * 0.15
  );
}

const SIMILARITY_THRESHOLD = 0.40;

/**
 * Format selisih waktu human-readable
 */
function formatTimeDiff(diffMs) {
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 60) return `${diffMinutes} menit lebih awal`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lebih awal`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari lebih awal`;
}

/**
 * Cari original source di pool (tanpa Google search tambahan)
 */
function findOriginalInPool(item, pool) {
  let best = null;
  let bestSim = 0;

  for (const candidate of pool) {
    if (candidate.link === item.link) continue;
    if (!candidate.pubDate || !item.pubDate) continue;
    if (candidate.pubDate >= item.pubDate) continue;

    // Quick pre-filter
    const itemKw = extractKeywords(item.title);
    const candKw = extractKeywords(candidate.title);
    let overlap = 0;
    for (const kw of itemKw) if (candKw.has(kw)) overlap++;
    if (overlap < 2) continue;

    const sim = getArticleSimilarity(item, candidate);
    if (sim >= SIMILARITY_THRESHOLD && sim > bestSim) {
      bestSim = sim;
      best = { candidate, sim };
    }
  }

  return best;
}

/**
 * Main dedup function
 *
 * @param {Array} displayItems - berita yang akan ditampilkan (3 jam terakhir)
 * @param {Array} dedupPool - pool 7 hari untuk perbandingan
 * @param {boolean} useGoogleSearch - kalau true, lakukan Google News search untuk top items
 */
export async function detectDuplicates(displayItems, dedupPool = [], useGoogleSearch = false) {
  // Combine: pool harus include displayItems juga (untuk perbandingan internal)
  const fullPool = [...displayItems];
  const linkSet = new Set(displayItems.map((i) => i.link));
  for (const p of dedupPool) {
    if (!linkSet.has(p.link)) {
      fullPool.push(p);
      linkSet.add(p.link);
    }
  }

  const result = [];

  for (const item of displayItems) {
    let originalSource = null;
    const found = findOriginalInPool(item, fullPool);

    if (found) {
      const { candidate, sim } = found;
      const timeDiff = formatTimeDiff(item.pubDate - candidate.pubDate);
      originalSource = {
        source: candidate.source,
        title: candidate.title,
        link: candidate.link,
        pubDate: candidate.pubDate,
        timeDiff,
        similarity: Math.round(sim * 100),
        viaGoogleSearch: false,
      };
    }

    result.push({
      ...item,
      originalSource,
      isOriginal: originalSource === null,
    });
  }

  // Optional: Google News fallback search untuk top viral items yang belum punya original
  if (useGoogleSearch) {
    // Hanya untuk items dengan viral score >= 50 yang belum punya original
    const candidates = result
      .filter((item) => !item.originalSource)
      .filter((item) => (item.viral?.viralScore || 0) >= 50)
      .slice(0, 10); // batasi 10 query saja

    const searchPromises = candidates.map(async (item) => {
      // Ambil 5-7 kata penting dari judul untuk dijadikan query
      const keywords = [...extractKeywords(item.title)].slice(0, 6);
      if (keywords.length < 3) return;

      const query = keywords.join(" ");

      try {
        const searchResults = await searchGoogleNewsForOriginal(query);
        let best = null;
        let bestSim = 0;

        for (const candidate of searchResults) {
          if (candidate.link === item.link) continue;
          if (!candidate.pubDate || !item.pubDate) continue;
          if (candidate.pubDate >= item.pubDate) continue;

          const sim = getArticleSimilarity(item, candidate);
          if (sim >= SIMILARITY_THRESHOLD && sim > bestSim) {
            bestSim = sim;
            best = { candidate, sim };
          }
        }

        if (best) {
          const { candidate, sim } = best;
          const timeDiff = formatTimeDiff(item.pubDate - candidate.pubDate);
          item.originalSource = {
            source: candidate.source,
            title: candidate.title,
            link: candidate.link,
            pubDate: candidate.pubDate,
            timeDiff,
            similarity: Math.round(sim * 100),
            viaGoogleSearch: true,
          };
          item.isOriginal = false;
        }
      } catch {
        // ignore
      }
    });

    await Promise.all(searchPromises);
  }

  return result;
}
