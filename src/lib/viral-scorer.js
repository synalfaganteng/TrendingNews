/**
 * Viral Scoring — Simple & Practical
 *
 * Score 0-100 berdasarkan:
 * - Recency (40) — kebaruan
 * - Keyword viral (40) — kata-kata yang sering meledak
 * - Emotional (20) — pemicu emosi
 *
 * Plus: content type classification (untuk insight, bukan filter)
 */

const VIRAL_KEYWORDS = {
  high: [
    "viral", "heboh", "geger", "gempar", "breaking", "darurat",
    "tewas", "meninggal", "korban", "kecelakaan", "gempa", "tsunami",
    "banjir", "longsor", "kebakaran", "korupsi", "ditangkap", "tersangka",
    "penipuan", "bunuh", "hilang", "ditemukan", "penggerebekan", "narkoba",
    "begal", "pembunuhan", "perampokan", "pelecehan", "penculikan",
    "ledakan", "kerusuhan", "terbakar", "tenggelam", "maut",
  ],
  medium: [
    "polisi", "gubernur", "bupati", "wali kota", "walikota",
    "demo", "protes", "bentrok", "ricuh", "ramai",
    "kontroversi", "skandal", "razia", "operasi", "sidak",
    "terungkap", "terbongkar", "diduga", "phk", "pecat",
  ],
  low: [
    "harga", "naik", "turun", "bbm", "listrik", "beras",
    "macet", "kemiskinan", "wisata",
  ],
};

const EMOTIONAL = {
  sad: ["sedih", "duka", "menangis", "haru", "mengharukan", "pilu", "miris", "tragis"],
  shock: ["kaget", "syok", "tak menyangka", "mendadak", "tiba-tiba", "nekat"],
  anger: ["marah", "geram", "kesal", "amuk", "ngamuk", "berang"],
  funny: ["lucu", "kocak", "ngakak", "gokil", "absurd"],
};

function getRecencyScore(pubDate) {
  if (!pubDate) return 10;
  const m = (Date.now() - pubDate) / 60000;
  if (m <= 10) return 40;
  if (m <= 30) return 32;
  if (m <= 60) return 22;
  if (m <= 120) return 12;
  return 6;
}

function getKeywordScore(text) {
  const lower = text.toLowerCase();
  let s = 0;
  for (const k of VIRAL_KEYWORDS.high) if (lower.includes(k)) s += 16;
  for (const k of VIRAL_KEYWORDS.medium) if (lower.includes(k)) s += 8;
  for (const k of VIRAL_KEYWORDS.low) if (lower.includes(k)) s += 4;
  return Math.min(s, 40);
}

function getEmotionalScore(text) {
  const lower = text.toLowerCase();
  let s = 0;
  for (const list of Object.values(EMOTIONAL)) {
    for (const k of list) if (lower.includes(k)) s += 5;
  }
  return Math.min(s, 20);
}

function getContentType(text) {
  const lower = text.toLowerCase();
  if (/(tewas|meninggal|kecelakaan|kebakaran|banjir|gempa|longsor|bunuh|pembunuhan)/.test(lower))
    return { type: "Peristiwa", icon: "🚨" };
  if (/(korupsi|polisi|tersangka|ditangkap|narkoba|razia|hukum|sidang|vonis)/.test(lower))
    return { type: "Hukum", icon: "⚖️" };
  if (/(gubernur|bupati|wali kota|dprd|pilkada|pemilu|politik|kebijakan)/.test(lower))
    return { type: "Politik", icon: "🏛️" };
  if (/(wisata|kuliner|festival|budaya|pariwisata|event)/.test(lower))
    return { type: "Wisata", icon: "🏝️" };
  if (/(ekonomi|harga|umkm|pasar|bisnis|bbm)/.test(lower))
    return { type: "Ekonomi", icon: "💰" };
  if (/(sekolah|kampus|mahasiswa|pendidikan|guru|siswa)/.test(lower))
    return { type: "Pendidikan", icon: "🎓" };
  if (/(bola|sepak|pertandingan|juara|atlet|olahraga|liga)/.test(lower))
    return { type: "Olahraga", icon: "⚽" };
  return { type: "Umum", icon: "📰" };
}

export function calculateViralScore(item) {
  const text = `${item.title} ${item.snippet || ""}`;
  const recencyScore = getRecencyScore(item.pubDate);
  const keywordScore = getKeywordScore(text);
  const emotionalScore = getEmotionalScore(text);

  const viralScore = Math.min(recencyScore + keywordScore + emotionalScore, 100);
  const contentType = getContentType(text);

  let viralLevel;
  if (viralScore >= 75) viralLevel = "🔥 Sangat Viral";
  else if (viralScore >= 55) viralLevel = "🟠 Berpotensi";
  else if (viralScore >= 35) viralLevel = "🟡 Cukup";
  else viralLevel = null;

  return {
    viralScore,
    viralLevel,
    contentType,
  };
}

export function attachViralScores(items) {
  return items.map((item) => ({
    ...item,
    viral: calculateViralScore(item),
  }));
}

export function rankByViralPotential(items) {
  const scored = attachViralScores(items);
  scored.sort((a, b) => (b.viral?.viralScore || 0) - (a.viral?.viralScore || 0));
  return scored;
}
