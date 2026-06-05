/**
 * Viral Scoring Engine v2 — Comprehensive
 *
 * Menghitung potensi viral & viewers berita berdasarkan:
 * 1. Recency (kecepatan) — makin baru makin tinggi
 * 2. Keyword viral — kata-kata yang sering meledak di sosmed
 * 3. Emotional triggers — pemicu emosi (sedih, marah, kaget, lucu)
 * 4. Platform fit — cocok di TikTok/IG/X/FB
 * 5. Reach potential — prediksi jangkauan pembaca
 * 6. Content type — klasifikasi jenis konten
 */

// ===== KEYWORD BANKS =====
const VIRAL_KEYWORDS = {
  high: [
    "viral", "heboh", "geger", "gempar", "breaking", "terkini", "darurat",
    "tewas", "meninggal", "korban", "kecelakaan", "gempa", "tsunami",
    "banjir", "longsor", "kebakaran", "korupsi", "ditangkap", "tersangka",
    "penipuan", "bunuh", "hilang", "ditemukan", "penggerebekan", "narkoba",
    "begal", "pembunuhan", "perampokan", "pelecehan", "penculikan",
    "ledakan", "kerusuhan", "terbakar", "tenggelam", "maut",
  ],
  medium: [
    "polisi", "gubernur", "bupati", "wali kota", "walikota", "presiden",
    "menteri", "demo", "protes", "mogok", "bentrok", "ricuh", "ramai",
    "panas", "kontroversi", "skandal", "mahal", "gratis", "bantuan",
    "subsidi", "phk", "pecat", "resign", "mutasi", "pilkada", "pemilu",
    "dprd", "anggota dewan", "kades", "lurah", "camat", "razia", "operasi",
    "sidak", "viral", "terungkap", "terbongkar", "diduga",
  ],
  low: [
    "harga", "naik", "turun", "bbm", "listrik", "beras", "sembako",
    "cuaca", "hujan", "penjualan", "proyek", "pembangunan", "jalan",
    "macet", "kemiskinan", "pengangguran", "wisata", "pariwisata",
    "umkm", "ekonomi", "pasar", "perbaikan", "renovasi",
  ],
};

// Emotional triggers — konten dengan emosi kuat lebih mudah viral
const EMOTIONAL_TRIGGERS = {
  sad: ["sedih", "duka", "menangis", "tangis", "haru", "mengharukan", "pilu", "miris", "tragis", "memilukan"],
  anger: ["marah", "geram", "kesal", "murka", "emosi", "amuk", "ngamuk", "berang", "protes"],
  shock: ["kaget", "syok", "terkejut", "tak menyangka", "mengejutkan", "mendadak", "tiba-tiba", "nekat"],
  funny: ["lucu", "kocak", "ngakak", "kocar", "gokil", "viral", "absurd", "receh", "ngeselin"],
  inspiring: ["inspiratif", "perjuangan", "pahlawan", "bangga", "prestasi", "juara", "menang", "sukses", "hebat"],
};

// Platform signals
const PLATFORM_SIGNALS = {
  tiktok: {
    label: "TikTok",
    icon: "🎵",
    keywords: [
      "viral", "heboh", "geger", "challenge", "prank", "drama", "emosional",
      "sedih", "mengharukan", "lucu", "kocak", "nekat", "berani", "terciduk",
      "kepergok", "panik", "histeris", "video", "rekaman", "cctv", "detik-detik",
      "aksi", "ngamuk", "ribut", "joget", "goyang",
    ],
    weight: 1.35,
  },
  instagram: {
    label: "Instagram",
    icon: "📷",
    keywords: [
      "foto", "video", "wisata", "kuliner", "event", "festival", "cantik",
      "mewah", "viral", "aesthetic", "spot", "destinasi", "cafe", "resto",
      "hotel", "fashion", "selebgram", "influencer", "potret", "pemandangan",
      "kuliner", "liburan", "pantai", "danau",
    ],
    weight: 1.1,
  },
  twitter: {
    label: "X / Twitter",
    icon: "𝕏",
    keywords: [
      "breaking", "politik", "korupsi", "demo", "gubernur", "presiden",
      "menteri", "dpr", "dprd", "kontroversi", "skandal", "trending", "thread",
      "fakta", "data", "statistik", "resmi", "kebijakan", "pernyataan",
      "klarifikasi", "tanggapan", "kritik", "sorot", "viral",
    ],
    weight: 1.2,
  },
  facebook: {
    label: "Facebook",
    icon: "👥",
    keywords: [
      "warga", "masyarakat", "desa", "kampung", "keluarga", "anak", "sekolah",
      "masjid", "gereja", "bantuan", "donasi", "duka", "berduka", "meninggal",
      "kecelakaan", "hilang", "ditemukan", "tolong", "viral", "info",
      "pengumuman", "lowongan", "umkm", "pedagang",
    ],
    weight: 1.05,
  },
};

// ===== SCORING FUNCTIONS =====

/**
 * Recency score (0-35) — kecepatan/kebaruan
 */
function getRecencyScore(pubDate) {
  if (!pubDate) return 12;
  const minutesAgo = (Date.now() - pubDate) / 60000;
  if (minutesAgo <= 5) return 35;
  if (minutesAgo <= 15) return 30;
  if (minutesAgo <= 30) return 25;
  if (minutesAgo <= 60) return 18;
  if (minutesAgo <= 120) return 10;
  return 5;
}

/**
 * Keyword score (0-45)
 */
function getKeywordScore(text) {
  const lower = text.toLowerCase();
  let score = 0;
  for (const kw of VIRAL_KEYWORDS.high) if (lower.includes(kw)) score += 18;
  for (const kw of VIRAL_KEYWORDS.medium) if (lower.includes(kw)) score += 9;
  for (const kw of VIRAL_KEYWORDS.low) if (lower.includes(kw)) score += 4;
  return Math.min(score, 45);
}

/**
 * Emotional score (0-20) + detect dominant emotion
 */
function getEmotionalScore(text) {
  const lower = text.toLowerCase();
  let score = 0;
  const emotions = [];

  for (const [emotion, keywords] of Object.entries(EMOTIONAL_TRIGGERS)) {
    let hits = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) hits++;
    }
    if (hits > 0) {
      score += hits * 6;
      emotions.push({ emotion, hits });
    }
  }

  emotions.sort((a, b) => b.hits - a.hits);
  const dominant = emotions.length > 0 ? emotions[0].emotion : null;

  return { score: Math.min(score, 20), dominantEmotion: dominant };
}

/**
 * Platform scores — which platforms this fits best
 */
function getPlatformScores(text) {
  const lower = text.toLowerCase();
  const results = [];
  for (const [platform, config] of Object.entries(PLATFORM_SIGNALS)) {
    let matches = 0;
    for (const kw of config.keywords) {
      if (lower.includes(kw)) matches++;
    }
    if (matches > 0) {
      results.push({
        platform,
        label: config.label,
        icon: config.icon,
        score: Math.round(matches * config.weight * 10),
        matches,
      });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Estimate reach/viewers potential
 * Berbasis: viral score + apakah ada keyword high-reach + lokasi besar
 */
const HIGH_REACH_CITIES = ["medan", "batam", "pekanbaru", "padang", "banda aceh"];

function getReachPotential(text, viralScore) {
  const lower = text.toLowerCase();
  let multiplier = 1;

  // Kota besar = jangkauan lebih luas
  if (HIGH_REACH_CITIES.some((c) => lower.includes(c))) multiplier += 0.3;

  // Topik nasional/luas
  if (/(viral|nasional|indonesia|presiden|menteri)/.test(lower)) multiplier += 0.2;

  const base = viralScore * 1000 * multiplier;

  // Buckets estimasi viewers
  let label, range;
  if (base >= 70000) {
    label = "Sangat Tinggi";
    range = "100rb+";
  } else if (base >= 50000) {
    label = "Tinggi";
    range = "50rb–100rb";
  } else if (base >= 30000) {
    label = "Sedang";
    range = "10rb–50rb";
  } else if (base >= 15000) {
    label = "Rendah";
    range = "1rb–10rb";
  } else {
    label = "Minim";
    range = "<1rb";
  }

  return { label, range, estimated: Math.round(base) };
}

/**
 * Classify content type
 */
function getContentType(text) {
  const lower = text.toLowerCase();
  if (/(tewas|meninggal|kecelakaan|kebakaran|banjir|gempa|longsor|bunuh|pembunuhan)/.test(lower))
    return { type: "Peristiwa", icon: "🚨" };
  if (/(korupsi|polisi|tersangka|ditangkap|narkoba|razia|hukum|sidang|vonis)/.test(lower))
    return { type: "Hukum & Kriminal", icon: "⚖️" };
  if (/(gubernur|bupati|wali kota|dprd|pilkada|pemilu|politik|kebijakan)/.test(lower))
    return { type: "Politik", icon: "🏛️" };
  if (/(wisata|kuliner|festival|budaya|pariwisata|event)/.test(lower))
    return { type: "Wisata & Budaya", icon: "🏝️" };
  if (/(ekonomi|harga|umkm|pasar|bisnis|investasi|bbm)/.test(lower))
    return { type: "Ekonomi", icon: "💰" };
  if (/(sekolah|kampus|mahasiswa|pendidikan|guru|siswa)/.test(lower))
    return { type: "Pendidikan", icon: "🎓" };
  if (/(bola|sepak|pertandingan|juara|atlet|olahraga|liga)/.test(lower))
    return { type: "Olahraga", icon: "⚽" };
  return { type: "Umum", icon: "📰" };
}

/**
 * MAIN: calculate comprehensive viral score
 */
export function calculateViralScore(item) {
  const text = `${item.title} ${item.snippet || ""}`;

  const recencyScore = getRecencyScore(item.pubDate);
  const keywordScore = getKeywordScore(text);
  const { score: emotionalScore, dominantEmotion } = getEmotionalScore(text);
  const platforms = getPlatformScores(text);
  const contentType = getContentType(text);

  // Total: recency(35) + keyword(45) + emotional(20) = max 100
  const viralScore = Math.min(
    recencyScore + keywordScore + emotionalScore,
    100
  );

  const reach = getReachPotential(text, viralScore);

  let viralLevel, levelColor;
  if (viralScore >= 75) {
    viralLevel = "🔥 Sangat Viral";
    levelColor = "red";
  } else if (viralScore >= 55) {
    viralLevel = "🟠 Berpotensi Viral";
    levelColor = "orange";
  } else if (viralScore >= 35) {
    viralLevel = "🟡 Cukup Menarik";
    levelColor = "yellow";
  } else {
    viralLevel = "⚪ Normal";
    levelColor = "gray";
  }

  return {
    viralScore,
    viralLevel,
    levelColor,
    platforms: platforms.slice(0, 4),
    bestPlatform: platforms.length > 0 ? platforms[0] : null,
    reach,
    contentType,
    dominantEmotion,
    breakdown: { recencyScore, keywordScore, emotionalScore },
  };
}

/**
 * Score & sort all items by viral potential
 */
export function rankByViralPotential(items) {
  const scored = items.map((item) => ({
    ...item,
    viral: calculateViralScore(item),
  }));
  scored.sort((a, b) => b.viral.viralScore - a.viral.viralScore);
  return scored;
}

/**
 * Just attach scores without sorting (for time-based sort)
 */
export function attachViralScores(items) {
  return items.map((item) => ({
    ...item,
    viral: calculateViralScore(item),
  }));
}
