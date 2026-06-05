/**
 * Deteksi Berita Duplikat / Rewrite
 *
 * Membandingkan JUDUL + ISI (snippet) berita.
 * Jika dua berita membahas topik yang sama → tandai mana yang pertama publish.
 *
 * Metode:
 * 1. Keyword overlap pada judul (bobot 40%)
 * 2. Keyword overlap pada isi/snippet (bobot 40%)
 * 3. Bigram similarity pada judul (bobot 20%)
 *
 * Threshold: combined score >= 0.40 = topik sama
 */

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
  "the", "and", "for", "was", "are", "but", "not", "you", "all",
  "can", "had", "her", "one", "our", "out", "day", "get", "has",
]);

/**
 * Normalize text — lowercase, hapus tanda baca
 */
function normalize(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Extract meaningful keywords (hapus stopwords, minimal 3 huruf)
 */
function extractKeywords(text) {
  const normalized = normalize(text);
  if (!normalized) return new Set();
  return new Set(
    normalized
      .split(" ")
      .filter((w) => w.length >= 3 && !STOPWORDS.has(w))
  );
}

/**
 * Generate bigrams dari text
 */
function getBigrams(text) {
  const words = normalize(text).split(" ");
  const bigrams = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

/**
 * Jaccard similarity antara dua Set
 */
function jaccard(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Overlap coefficient — proporsi dari set terkecil yang cocok
 * Lebih baik untuk kasus di mana satu judul panjang, satu pendek
 */
function overlapCoefficient(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  return intersection / Math.min(setA.size, setB.size);
}

/**
 * Calculate combined similarity between two articles
 * Uses BOTH title AND content/snippet
 */
function getArticleSimilarity(articleA, articleB) {
  const titleA = articleA.title || "";
  const titleB = articleB.title || "";
  const contentA = articleA.snippet || "";
  const contentB = articleB.snippet || "";

  // 1. Title keyword overlap (overlap coefficient — catches rewrites)
  const titleKwA = extractKeywords(titleA);
  const titleKwB = extractKeywords(titleB);
  const titleKeywordScore = overlapCoefficient(titleKwA, titleKwB);

  // 2. Content/snippet keyword overlap
  const contentKwA = extractKeywords(contentA);
  const contentKwB = extractKeywords(contentB);
  const contentKeywordScore = overlapCoefficient(contentKwA, contentKwB);

  // 3. Title bigram similarity (catches near-identical titles)
  const titleBigramA = getBigrams(titleA);
  const titleBigramB = getBigrams(titleB);
  const titleBigramScore = jaccard(titleBigramA, titleBigramB);

  // 4. Combined full text keywords (title + content together)
  const fullKwA = extractKeywords(`${titleA} ${contentA}`);
  const fullKwB = extractKeywords(`${titleB} ${contentB}`);
  const fullKeywordScore = overlapCoefficient(fullKwA, fullKwB);

  // Weighted combination:
  // - Title keywords: 30% (catches rewritten headlines)
  // - Content keywords: 30% (catches same story different headline)
  // - Full text combined: 25% (overall topic match)
  // - Title bigrams: 15% (catches copy-paste titles)
  const combined =
    titleKeywordScore * 0.3 +
    contentKeywordScore * 0.3 +
    fullKeywordScore * 0.25 +
    titleBigramScore * 0.15;

  return combined;
}

// Threshold — 0.40 berarti ~40% kesamaan topik
const SIMILARITY_THRESHOLD = 0.40;

/**
 * Main function: detect duplicates and mark original sources
 *
 * @param {Array} items - news items (any order, will check pubDate)
 * @returns {Array} items with `originalSource` and `isOriginal` fields
 */
export function detectDuplicates(items) {
  // Pre-compute keywords for performance
  const precomputed = items.map((item) => ({
    item,
    titleKw: extractKeywords(item.title || ""),
    contentKw: extractKeywords(item.snippet || ""),
    fullKw: extractKeywords(`${item.title || ""} ${item.snippet || ""}`),
    titleBigrams: getBigrams(item.title || ""),
  }));

  const result = items.map((item, idx) => {
    let originalSource = null;
    let highestSim = 0;

    const current = precomputed[idx];

    for (let j = 0; j < items.length; j++) {
      if (j === idx) continue;

      const other = precomputed[j];
      const otherItem = other.item;

      // Skip if same link
      if (item.link === otherItem.link) continue;

      // Only compare with items that are OLDER
      if (!otherItem.pubDate || !item.pubDate) continue;
      if (otherItem.pubDate >= item.pubDate) continue;

      // Quick pre-filter: if titles share zero keywords, skip expensive comparison
      let hasAnyOverlap = false;
      for (const kw of current.titleKw) {
        if (other.titleKw.has(kw) || other.contentKw.has(kw)) {
          hasAnyOverlap = true;
          break;
        }
      }
      if (!hasAnyOverlap) {
        // Also check content keywords
        for (const kw of current.contentKw) {
          if (other.titleKw.has(kw) || other.contentKw.has(kw)) {
            hasAnyOverlap = true;
            break;
          }
        }
      }
      if (!hasAnyOverlap) continue;

      // Full similarity calculation
      const sim = getArticleSimilarity(item, otherItem);

      if (sim >= SIMILARITY_THRESHOLD && sim > highestSim) {
        highestSim = sim;

        // Calculate time difference
        const diffMs = item.pubDate - otherItem.pubDate;
        const diffMinutes = Math.floor(diffMs / 60000);
        let timeDiff;
        if (diffMinutes < 60) {
          timeDiff = `${diffMinutes} menit lebih awal`;
        } else {
          const diffHours = Math.floor(diffMinutes / 60);
          if (diffHours < 24) {
            timeDiff = `${diffHours} jam lebih awal`;
          } else {
            const diffDays = Math.floor(diffHours / 24);
            timeDiff = `${diffDays} hari lebih awal`;
          }
        }

        originalSource = {
          source: otherItem.source,
          title: otherItem.title,
          link: otherItem.link,
          pubDate: otherItem.pubDate,
          timeDiff,
          similarity: Math.round(sim * 100),
        };
      }
    }

    return {
      ...item,
      originalSource,
      isOriginal: originalSource === null,
    };
  });

  return result;
}
