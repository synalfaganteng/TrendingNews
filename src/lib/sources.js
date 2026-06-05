/**
 * Daftar sumber berita terverifikasi Dewan Pers
 * Provinsi: Sumatera Utara, Sumatera Barat, Aceh, Riau, Kepulauan Riau
 * Status: Terverifikasi Faktual
 * Jenis: Media Siber
 *
 * Catatan: RSS feed URL bisa berubah. Tambah/edit di sini sesuai kebutuhan.
 * Beberapa media mungkin tidak punya RSS — kita skip otomatis jika gagal fetch.
 */

export const MEDIA_SOURCES = [
  // === SUMATERA UTARA ===
  {
    name: "Analisa Daily",
    province: "Sumatera Utara",
    rss: "https://analisadaily.com/feed",
    website: "https://analisadaily.com",
  },
  {
    name: "Waspada Online",
    province: "Sumatera Utara",
    rss: "https://waspada.id/feed",
    website: "https://waspada.id",
  },
  {
    name: "MedanBisnisDaily",
    province: "Sumatera Utara",
    rss: "https://medanbisnisdaily.com/feed",
    website: "https://medanbisnisdaily.com",
  },
  {
    name: "GoSumut",
    province: "Sumatera Utara",
    rss: "https://gosumut.com/feed",
    website: "https://gosumut.com",
  },
  {
    name: "Tribun Medan",
    province: "Sumatera Utara",
    rss: "https://medan.tribunnews.com/rss",
    website: "https://medan.tribunnews.com",
  },
  {
    name: "Harian SIB",
    province: "Sumatera Utara",
    rss: "https://hariansib.com/feed",
    website: "https://hariansib.com",
  },
  {
    name: "MistarDaily",
    province: "Sumatera Utara",
    rss: "https://mistar.id/feed",
    website: "https://mistar.id",
  },

  // === ACEH ===
  {
    name: "Serambi Indonesia",
    province: "Aceh",
    rss: "https://aceh.tribunnews.com/rss",
    website: "https://aceh.tribunnews.com",
  },
  {
    name: "Dialeksis",
    province: "Aceh",
    rss: "https://dialeksis.com/feed",
    website: "https://dialeksis.com",
  },
  {
    name: "Ajnn.net",
    province: "Aceh",
    rss: "https://www.ajnn.net/feed",
    website: "https://www.ajnn.net",
  },
  {
    name: "Modusaceh",
    province: "Aceh",
    rss: "https://modusaceh.co/feed",
    website: "https://modusaceh.co",
  },

  // === SUMATERA BARAT ===
  {
    name: "Harianhaluan",
    province: "Sumatera Barat",
    rss: "https://harianhaluan.com/feed",
    website: "https://harianhaluan.com",
  },
  {
    name: "Langgam.id",
    province: "Sumatera Barat",
    rss: "https://langgam.id/feed",
    website: "https://langgam.id",
  },
  {
    name: "Tribun Padang",
    province: "Sumatera Barat",
    rss: "https://padang.tribunnews.com/rss",
    website: "https://padang.tribunnews.com",
  },
  {
    name: "Covesia",
    province: "Sumatera Barat",
    rss: "https://covesia.com/feed",
    website: "https://covesia.com",
  },

  // === RIAU ===
  {
    name: "Tribun Pekanbaru",
    province: "Riau",
    rss: "https://pekanbaru.tribunnews.com/rss",
    website: "https://pekanbaru.tribunnews.com",
  },
  {
    name: "GoRiau",
    province: "Riau",
    rss: "https://goriau.com/feed",
    website: "https://goriau.com",
  },
  {
    name: "Riaupos",
    province: "Riau",
    rss: "https://riaupos.jawapos.com/feed",
    website: "https://riaupos.jawapos.com",
  },
  {
    name: "Cakaplah",
    province: "Riau",
    rss: "https://www.cakaplah.com/feed",
    website: "https://www.cakaplah.com",
  },

  // === KEPULAUAN RIAU ===
  {
    name: "Tribun Batam",
    province: "Kepulauan Riau",
    rss: "https://batam.tribunnews.com/rss",
    website: "https://batam.tribunnews.com",
  },
  {
    name: "Batampos",
    province: "Kepulauan Riau",
    rss: "https://batampos.co.id/feed",
    website: "https://batampos.co.id",
  },
  {
    name: "Sijoritoday",
    province: "Kepulauan Riau",
    rss: "https://sijoritoday.com/feed",
    website: "https://sijoritoday.com",
  },
];

// Google Trends RSS (Indonesia)
export const GOOGLE_TRENDS_RSS =
  "https://trends.google.co.id/trends/trendingsearches/daily/rss?geo=ID";

// Google News RSS — regional queries
export const GOOGLE_NEWS_FEEDS = [
  {
    label: "Sumatera Utara",
    rss: "https://news.google.com/rss/search?q=Sumatera+Utara&hl=id&gl=ID&ceid=ID:id",
  },
  {
    label: "Aceh",
    rss: "https://news.google.com/rss/search?q=Aceh&hl=id&gl=ID&ceid=ID:id",
  },
  {
    label: "Sumatera Barat",
    rss: "https://news.google.com/rss/search?q=Sumatera+Barat&hl=id&gl=ID&ceid=ID:id",
  },
  {
    label: "Riau",
    rss: "https://news.google.com/rss/search?q=Riau&hl=id&gl=ID&ceid=ID:id",
  },
  {
    label: "Kepulauan Riau",
    rss: "https://news.google.com/rss/search?q=Kepulauan+Riau&hl=id&gl=ID&ceid=ID:id",
  },
];
