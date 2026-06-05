/**
 * Region Filter — memastikan berita yang ditampilkan HANYA yang
 * kejadiannya di Sumatera Utara.
 *
 * Logika:
 * 1. Cek apakah berita menyebut wilayah Sumut (kota/kab/keyword)
 * 2. Cek apakah berita menyebut lokasi LUAR Sumut
 * 3. Keputusan:
 *    - Menyebut Sumut DAN TIDAK menyebut luar → LOLOS ✅
 *    - Menyebut Sumut DAN menyebut luar → LOLOS ✅ (mungkin berita perbandingan)
 *    - TIDAK menyebut Sumut DAN menyebut luar → BUANG ❌
 *    - TIDAK menyebut keduanya → BUANG ❌ (tidak bisa dipastikan lokasi)
 */

import { SUMUT_KEYWORDS } from "./sources";

// Lokasi di luar Sumatera Utara yang sering muncul di berita
// Jika berita menyebut ini TANPA menyebut Sumut → buang
const NON_SUMUT_LOCATIONS = [
  // Pulau Jawa
  "Jakarta",
  "Bogor",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bandung",
  "Semarang",
  "Surabaya",
  "Yogyakarta",
  "Jogja",
  "Solo",
  "Malang",
  "Cirebon",
  "Surakarta",
  "Serang",
  "Banten",

  // Luar Jawa
  "Makassar",
  "Manado",
  "Denpasar",
  "Bali",
  "Lombok",
  "Mataram",
  "Balikpapan",
  "Samarinda",
  "Pontianak",
  "Banjarmasin",
  "Palembang",
  "Lampung",
  "Bengkulu",
  "Jambi",
  "Jayapura",
  "Papua",
  "Ambon",
  "Maluku",
  "Kendari",
  "Palu",
  "Gorontalo",
  "Kupang",
  "NTT",
  "NTB",
  "Sulawesi",
  "Kalimantan",

  // Aceh (nanti bisa dipindah kalau Aceh sudah dipetakan)
  "Banda Aceh",
  "Lhokseumawe",
  "Langsa",
  "Sabang",
  "Aceh Besar",
  "Pidie",
  "Bireuen",
  "Aceh Utara",
  "Aceh Timur",
  "Aceh Selatan",
  "Aceh Barat",
  "Aceh Tengah",
  "Gayo Lues",
  "Nagan Raya",
  "Aceh Singkil",
  "Simeulue",
  "Bener Meriah",
  "Aceh Tamiang",

  // Sumatera Barat
  "Padang",
  "Bukittinggi",
  "Payakumbuh",
  "Solok",
  "Sawahlunto",
  "Pariaman",

  // Riau & Kepri
  "Pekanbaru",
  "Dumai",
  "Batam",
  "Tanjung Pinang",
  "Bintan",
  "Karimun",

  // Internasional
  "Malaysia",
  "Singapura",
  "Singapore",
  "Thailand",
  "Amerika",
  "China",
  "Jepang",
  "Korea",
  "Eropa",
  "Australia",
  "Palestina",
  "Israel",
  "Gaza",
  "Ukraina",
  "Rusia",
];

/**
 * Check if text mentions any Sumut region/keyword
 */
function mentionsSumut(text) {
  const lower = text.toLowerCase();
  return SUMUT_KEYWORDS.some((keyword) =>
    lower.includes(keyword.toLowerCase())
  );
}

/**
 * Check if text mentions a non-Sumut location
 */
function mentionsNonSumut(text) {
  const lower = text.toLowerCase();
  return NON_SUMUT_LOCATIONS.some((loc) =>
    lower.includes(loc.toLowerCase())
  );
}

/**
 * Determine if a news item should be displayed
 * @param {string} text - full text (title + snippet)
 * @returns {boolean} true if the news is relevant to Sumut
 */
export function isRelevantToSumut(text) {
  if (!text) return false;

  const hasSumut = mentionsSumut(text);
  const hasNonSumut = mentionsNonSumut(text);

  // Menyebut Sumut → lolos (mau ada sebut luar atau tidak)
  if (hasSumut) return true;

  // Tidak menyebut Sumut sama sekali → buang
  // (entah itu berita luar, atau berita generik tanpa lokasi)
  return false;
}
