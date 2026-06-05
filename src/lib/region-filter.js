/**
 * Region Filter — Strict
 *
 * Aturan:
 * 1. JUDUL harus menyebut wilayah yang dipetakan (Sumut/Aceh/Sumbar/Riau/Kepri)
 *    ATAU snippet awal (200 char pertama) menyebut wilayah
 * 2. Kalau judul/isi menyebut negara asing → BUANG (walaupun ada nama Sumut)
 *    Contoh: "Banjir di Lombok hingga ke Medan" tetap dibuang karena utamanya Lombok
 *    Kecuali eksplisit "Sumut", "Sumatera Utara" sebagai subjek utama
 */

import { ALL_VALID_KEYWORDS, ALL_REGIONS, PROVINCE_REGIONS } from "./sources";

// Negara/wilayah asing yang harus auto-exclude
const FOREIGN_BLACKLIST = [
  // Negara
  "amerika", "amerika serikat", "as ", " usa", "united states",
  "china", "tiongkok", "tionghoa", "beijing", "shanghai", "hong kong",
  "jepang", "japan", "tokyo", "osaka",
  "korea selatan", "korea utara", "seoul", "pyongyang",
  "rusia", "russia", "moskow", "moscow",
  "ukraina", "ukraine", "kyiv",
  "israel", "tel aviv",
  "palestina", "gaza", "tepi barat", "west bank", "jerusalem", "yerusalem",
  "iran", "teheran",
  "irak", "iraq", "baghdad",
  "suriah", "syria", "damaskus", "damascus",
  "yaman", "yemen",
  "lebanon", "libanon", "beirut",
  "turki", "turkey", "istanbul", "ankara",
  "arab saudi", "saudi", "riyadh", "mekkah", "madinah",
  "qatar", "doha",
  "uea", "uni emirat", "dubai", "abu dhabi",
  "mesir", "egypt", "kairo", "cairo",
  "afghanistan", "kabul",
  "pakistan", "islamabad",
  "india", "new delhi", "mumbai", "kashmir",
  "thailand", "bangkok",
  "vietnam", "hanoi",
  "filipina", "philippines", "manila",
  "myanmar", "rangoon", "yangon",
  "kamboja", "cambodia", "phnom penh",
  "laos", "vientiane",
  "malaysia", "kuala lumpur", "selangor", "johor", "penang", "sabah", "sarawak",
  "singapura", "singapore",
  "brunei",
  "australia", "sydney", "melbourne", "canberra",
  "selandia baru", "new zealand",
  "kanada", "canada", "ottawa", "toronto",
  "meksiko", "mexico",
  "brasil", "brazil",
  "argentina",
  "inggris", "britania", "uk", "london", "manchester",
  "prancis", "perancis", "france", "paris",
  "jerman", "germany", "berlin",
  "italia", "italy", "roma", "rome", "milan",
  "spanyol", "spain", "madrid", "barcelona",
  "belanda", "netherlands", "amsterdam",
  "swedia", "norwegia", "denmark", "finlandia",
  "polandia", "yunani", "athena",
  "afrika selatan", "nigeria", "kenya",
  // Internasional umum
  "internasional", "global", "luar negeri",
];

// Wilayah Indonesia di luar provinsi yg dipetakan — harus exclude
const NON_TARGET_INDONESIA = [
  // Jakarta & sekitarnya
  "jakarta", "bekasi", "depok", "tangerang", "bogor", "jabodetabek",
  // Jawa Barat
  "bandung", "cirebon", "garut", "tasikmalaya", "sukabumi", "cianjur", "bekasi",
  // Jawa Tengah & DIY
  "semarang", "solo", "surakarta", "yogyakarta", "jogja", "magelang", "purwokerto",
  // Jawa Timur
  "surabaya", "malang", "kediri", "madura", "banyuwangi",
  // Banten
  "banten", "serang", "cilegon", "lebak", "pandeglang",
  // Bali, NTB, NTT
  "bali", "denpasar", "kuta", "ubud", "lombok", "mataram", "ntb", "ntt", "kupang",
  // Sumatera selain target
  "palembang", "lampung", "bengkulu", "jambi", "sumatera selatan", "sumsel",
  "babel", "bangka", "belitung",
  // Kalimantan
  "kalimantan", "balikpapan", "samarinda", "pontianak", "banjarmasin", "ikn",
  // Sulawesi
  "sulawesi", "makassar", "manado", "kendari", "palu", "gorontalo",
  // Papua, Maluku
  "papua", "jayapura", "ambon", "maluku",
];

const ALL_BLACKLIST = [...FOREIGN_BLACKLIST, ...NON_TARGET_INDONESIA];

/**
 * Cek apakah text mengandung kata blacklist (negara asing / Indonesia luar target)
 */
function hasBlacklistedLocation(text) {
  if (!text) return false;
  const lower = ` ${text.toLowerCase()} `; // pad with spaces for word boundary
  return ALL_BLACKLIST.some((bad) => lower.includes(` ${bad} `) || lower.includes(` ${bad}.`) || lower.includes(` ${bad},`));
}

/**
 * Cek apakah text menyebut wilayah target
 */
function mentionsTarget(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ALL_VALID_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

/**
 * MAIN FILTER:
 * Lolos jika:
 * - JUDUL menyebut wilayah target, ATAU
 * - 200 char pertama snippet menyebut wilayah target
 * Dan TIDAK ada blacklist location
 */
export function isRelevantToMappedRegions(title, snippet = "") {
  if (!title) return false;

  const headSnippet = (snippet || "").slice(0, 250);
  const fullCheck = `${title} ${headSnippet}`;

  // Cek blacklist DULU — kalau ada, langsung buang
  if (hasBlacklistedLocation(fullCheck)) {
    // Special case: kalau judul jelas2 sebut "Sumatera Utara"/"Sumut"/"Aceh"/dll
    // sebagai subjek utama, izinkan walau ada kata negara
    const titleLower = title.toLowerCase();
    const explicitProvinces = [
      "sumatera utara", "sumut", "aceh", "sumatera barat", "sumbar",
      "minangkabau", "minang", "riau", "kepulauan riau", "kepri",
    ];
    const hasExplicit = explicitProvinces.some((p) => titleLower.includes(p));
    if (!hasExplicit) return false;
  }

  // Wilayah target HARUS muncul di judul atau awal snippet
  if (mentionsTarget(title)) return true;
  if (mentionsTarget(headSnippet)) return true;

  return false;
}

/**
 * Detect provinces mentioned (untuk metadata)
 */
export function detectProvinces(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const result = [];
  for (const [province, keywords] of Object.entries(PROVINCE_REGIONS)) {
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      result.push(province);
    }
  }
  return result;
}

/**
 * Detect specific kota/kabupaten
 */
export function detectKotaKab(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return ALL_REGIONS.filter((r) => lower.includes(r.toLowerCase()));
}
