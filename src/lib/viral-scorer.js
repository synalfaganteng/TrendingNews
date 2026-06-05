/**
 * Viral Scoring Engine
 *
 * Menghitung potensi viral berita berdasarkan:
 * 1. Recency (seberapa baru)
 * 2. Keyword matching (kata-kata yang sering viral)
 * 3. Platform relevance (cocok di platform mana)
 */

// Kata kunci yang sering viral di media sosial Indonesia
const VIRAL_KEYWORDS = {
  // High viral potential (score +30 each)
  high: [
    "viral",
    "heboh",
    "geger",
    "gempar",
    "breaking",
    "terkini",
    "darurat",
    "tewas",
    "meninggal",
    "korban",
    "kecelakaan",
    "gempa",
    "tsunami",
    "banjir",
    "longsor",
    "kebakaran",
    "korupsi",
    "ditangkap",
    "tersangka",
    "penipuan",
    "bunuh",
    "hilang",
    "ditemukan",
  ],
  // Medium viral potential (score +15 each)
  medium: [
    "polisi",
    "gubernur",
    "bupati",
    "wali kota",
    "presiden",
    "menteri",
    "demo",
    "protes",
    "mogok",
    "bentrok",
    "ricuh",
    "ramai",
    "panas",
    "kontroversi",
    "skandal",
    "mahal",
    "gratis",
    "bantuan",
    "subsidi",
    "phk",
    "pecat",
    "resign",
    "mutasi",
    "pilkada",
    "pemilu",
  ],
  // Low-medium viral potential (score +8 each)
  low: [
    "harga",
    "naik",
    "turun",
    "bbm",
    "listrik",
    "beras",
    "sembako",
    "cuaca",
    "hujan",
    "penjualan",
    "proyek",
    "pembangunan",
    "jalan",
    "macet",
    "kemiskinan",
    "pengangguran",
    "wisata",
    "pariwisata",
  ],
};

// Platform-specific keywords
const PLATFORM_SIGNALS = {
  tiktok: {
    keywords: [
      "viral",
      "heboh",
      "geger",
      "challenge",
      "prank",
      "drama",
      "emosional",
      "sedih",
      "mengharukan",
      "lucu",
      "kocak",
      "nekat",
      "berani",
      "terciduk",
      "kepergok",
      "panik",
      "histeris",
    ],
    weight: 1.3,
  },
  twitter: {
    keywords: [
      "breaking",
      "politik",
      "korupsi",
      "demo",
      "gubernur",
      "presiden",
      "menteri",
      "dpr",
      "kontroversi",
      "skandal",
      "trending",
      "thread",
      "fakta",
      "data",
      "statistik",
      "resmi",
      "kebijakan",
    ],
    weight: 1.2,
  },
  instagram: {
    keywords: [
      "foto",
      "video",
      "wisata",
      "kuliner",
      "event",
      "festival",
      "cantik",
      "mewah",
      "viral",
      "aesthetic",
      "spot",
      "destinasi",
      "cafe",
      "resto",
      "hotel",
    ],
    weight: 1.0,
  },
  facebook: {
    keywords: [
      "warga",
      "masyarakat",
      "desa",
      "kampung",
      "keluarga",
      "anak",
      "sekolah",
      "masjid",
      "gereja",
      "bantuan",
      "donasi",
      "duka",
      "berduka",
      "meninggal",
      "kecelakaan",
      "hilang",
      "ditemukan",
      "tolong",
    ],
    weight: 1.1,
  },
};

/**
 * Calculate recency score (0-40 points)
 * Berita 0-10 menit: 40 poin
 * Berita 10-30 menit: 30 poin
 * Berita 30-60 menit: 20 poin
 * Berita 1-2 jam: 10 poin
 * Berita 2-3 jam: 5 poin
 */
function getRecencyScore(pubDate) {
  if (!pubDate) return 15; // default score if no date
  const minutesAgo = (Date.now() - pubDate) / 60000;

  if (minutesAgo <= 10) return 40;
  if (minutesAgo <= 30) return 30;
  if (minutesAgo <= 60) return 20;
  if (minutesAgo <= 120) return 10;
  return 5;
}

/**
 * Calculate keyword score (0-60+ points)
 */
function getKeywordScore(text) {
  const lower = text.toLowerCase();
  let score = 0;

  for (const keyword of VIRAL_KEYWORDS.high) {
    if (lower.includes(keyword)) score += 30;
  }
  for (const keyword of VIRAL_KEYWORDS.medium) {
    if (lower.includes(keyword)) score += 15;
  }
  for (const keyword of VIRAL_KEYWORDS.low) {
    if (lower.includes(keyword)) score += 8;
  }

  // Cap keyword score at 60
  return Math.min(score, 60);
}

/**
 * Determine which platforms this news is most likely to trend on
 * Returns array of { platform, score }
 */
function getPlatformScores(text) {
  const lower = text.toLowerCase();
  const results = [];

  for (const [platform, config] of Object.entries(PLATFORM_SIGNALS)) {
    let matches = 0;
    for (const keyword of config.keywords) {
      if (lower.includes(keyword)) matches++;
    }
    if (matches > 0) {
      results.push({
        platform,
        score: Math.round(matches * config.weight * 10),
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Main scoring function
 * Returns viral score (0-100) and platform predictions
 */
export function calculateViralScore(item) {
  const text = `${item.title} ${item.snippet || ""}`;

  const recencyScore = getRecencyScore(item.pubDate);
  const keywordScore = getKeywordScore(text);
  const platforms = getPlatformScores(text);

  // Total score: recency (40%) + keywords (60%), max 100
  const rawScore = recencyScore + keywordScore;
  const viralScore = Math.min(rawScore, 100);

  // Determine viral level
  let viralLevel;
  if (viralScore >= 70) viralLevel = "🔥 Sangat Viral";
  else if (viralScore >= 50) viralLevel = "🟠 Berpotensi Viral";
  else if (viralScore >= 30) viralLevel = "🟡 Cukup Menarik";
  else viralLevel = "⚪ Normal";

  return {
    viralScore,
    viralLevel,
    platforms: platforms.slice(0, 3), // top 3 platforms
    recencyScore,
    keywordScore,
  };
}

/**
 * Score and sort all news items by viral potential
 */
export function rankByViralPotential(items) {
  const scored = items.map((item) => ({
    ...item,
    viral: calculateViralScore(item),
  }));

  scored.sort((a, b) => b.viral.viralScore - a.viral.viralScore);
  return scored;
}
