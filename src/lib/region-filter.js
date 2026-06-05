/**
 * Region Filter — Multi-Provinsi
 *
 * Berita HANYA ditampilkan jika menyebut wilayah yang sudah dipetakan
 * (Sumatera Utara, Aceh, Sumatera Barat).
 *
 * Berita tentang Jakarta, Lombok, internasional, dll → BUANG.
 * Bahkan jika dari portal Sumut/Aceh/Sumbar — tetap dicek kontennya.
 */

import { ALL_VALID_KEYWORDS, ALL_REGIONS, PROVINCE_REGIONS } from "./sources";

/**
 * Check if text mentions any valid region from our mapped provinces
 * @returns {boolean}
 */
export function isRelevantToMappedRegions(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ALL_VALID_KEYWORDS.some((keyword) =>
    lower.includes(keyword.toLowerCase())
  );
}

/**
 * Detect which province(s) a news item belongs to based on content
 * @returns {string[]} array of province names
 */
export function detectProvinces(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  const provinces = [];

  for (const [province, keywords] of Object.entries(PROVINCE_REGIONS)) {
    const matches = keywords.some((kw) => lower.includes(kw.toLowerCase()));
    if (matches) provinces.push(province);
  }

  return provinces;
}

/**
 * Detect specific kota/kabupaten mentioned
 * @returns {string[]}
 */
export function detectKotaKab(text) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return ALL_REGIONS.filter((region) =>
    lower.includes(region.toLowerCase())
  );
}
