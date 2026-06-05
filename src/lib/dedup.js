/**
 * Deteksi Berita Duplikat / Rewrite
 *
 * Logika:
 * 1. Bandingkan judul berita satu sama lain menggunakan similarity score
 * 2. Jika dua berita punya similarity >= 50%, mereka kemungkinan topik sama
 * 3. Yang publish paling awal = sumber pertama (originalSource)
 * 4. Yang publish belakangan = rewrite, ditandai dengan "Pertama ditulis oleh: X"
 *
 * Metode: Jaccard similarity pada bigrams (pasangan kata)
 */

/**
 * Normalize text for comparison — lowercase, hapus tanda baca, stopwords
 */
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Generate bigrams (pasangan 2 kata berurutan)
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
 * Calculate Jaccard similarity between two sets
 * Returns 0-1 (0 = totally different, 1 = identical)
 */
function jaccardSimilarity(setA, setB) {
  if (setA.size === 0 && setB.size === 0) return 0;

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Juga cek keyword overlap (kata-kata penting yang sama)
 * Ini untuk catch kasus di mana judul ditulis ulang tapi topiknya sama
 */
function getKeywords(text) {
  const stopwords = new Set([
    "yang", "dan", "di", "ke", "dari", "ini", "itu", "dengan", "untuk",
    "pada", "adalah", "akan", "telah", "sudah", "tidak", "bisa", "ada",
    "juga", "lebih", "oleh", "setelah", "saat", "dalam", "karena",
    "seperti", "kata", "dapat", "harus", "mereka", "kami", "kita",
    "atau", "tapi", "namun", "lalu", "serta", "hingga", "sampai",
    "usai", "pasca", "akibat",
  ]);

  return new Set(
    normalize(text)
      .split(" ")
      .filter((w) => w.length > 3 && !stopwords.has(w))
  );
}

function keywordOverlap(textA, textB) {
  const kwA = getKeywords(textA);
  const kwB = getKeywords(textB);
  if (kwA.size === 0 || kwB.size === 0) return 0;

  let matches = 0;
  for (const kw of kwA) {
    if (kwB.has(kw)) matches++;
  }

  // Return proportion of smaller set that matches
  const minSize = Math.min(kwA.size, kwB.size);
  return matches / minSize;
}

/**
 * Calculate combined similarity score
 */
function getSimilarity(titleA, titleB) {
  const bigramScore = jaccardSimilarity(getBigrams(titleA), getBigrams(titleB));
  const keywordScore = keywordOverlap(titleA, titleB);

  // Weighted: 40% bigram + 60% keyword overlap
  return bigramScore * 0.4 + keywordScore * 0.6;
}

// Threshold for considering two articles as same story
const SIMILARITY_THRESHOLD = 0.45;

/**
 * Main function: detect duplicates and mark original sources
 *
 * @param {Array} items - news items sorted by pubDate (newest first)
 * @returns {Array} items with added `originalSource` field
 *
 * originalSource = {
 *   source: "Langgam.id",
 *   title: "Judul asli...",
 *   link: "https://...",
 *   pubDate: 1234567890,
 *   timeDiff: "15 jam lebih awal"
 * }
 */
export function detectDuplicates(items) {
  // Group by clusters of similar stories
  // For each item, find if there's an earlier item with similar title

  const result = items.map((item, idx) => {
    let originalSource = null;
    let highestSim = 0;

    // Compare with all other items
    for (let j = 0; j < items.length; j++) {
      if (j === idx) continue;
      if (item.link === items[j].link) continue; // same article

      const other = items[j];

      // Only look at items that are OLDER than current
      if (!other.pubDate || !item.pubDate) continue;
      if (other.pubDate >= item.pubDate) continue; // not older

      const sim = getSimilarity(item.title, other.title);

      if (sim >= SIMILARITY_THRESHOLD && sim > highestSim) {
        highestSim = sim;

        // Calculate time difference
        const diffMs = item.pubDate - other.pubDate;
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
          source: other.source,
          title: other.title,
          link: other.link,
          pubDate: other.pubDate,
          timeDiff,
          similarity: Math.round(sim * 100),
        };
      }
    }

    return {
      ...item,
      originalSource,
      isOriginal: originalSource === null, // true jika ini berita pertama
    };
  });

  return result;
}
