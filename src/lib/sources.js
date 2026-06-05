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

  // === ACEH (33 portal — data Dewan Pers terverifikasi faktual) ===
  {
    name: "Masakini.co",
    province: "Aceh",
    rss: "https://masakini.co/feed",
    website: "https://masakini.co",
  },
  {
    name: "KabarTamiang.com",
    province: "Aceh",
    rss: "https://kabartamiang.com/feed",
    website: "https://kabartamiang.com",
  },
  {
    name: "BeritaMerdeka.net",
    province: "Aceh",
    rss: "https://beritamerdeka.net/feed",
    website: "https://beritamerdeka.net",
  },
  {
    name: "AcehBisnis.com",
    province: "Aceh",
    rss: "https://acehbisnis.com/feed",
    website: "https://acehbisnis.com",
  },
  {
    name: "AnteroAceh.com",
    province: "Aceh",
    rss: "https://anteroaceh.com/feed",
    website: "https://anteroaceh.com",
  },
  {
    name: "AcehVideo.tv",
    province: "Aceh",
    rss: "https://acehvideo.tv/feed",
    website: "https://acehvideo.tv",
  },
  {
    name: "TheAcehPost.com",
    province: "Aceh",
    rss: "https://theacehpost.com/feed",
    website: "https://theacehpost.com",
  },
  {
    name: "AcehPortal.com",
    province: "Aceh",
    rss: "https://acehportal.com/feed",
    website: "https://acehportal.com",
  },
  {
    name: "AnalisaAceh.com",
    province: "Aceh",
    rss: "https://analisaaceh.com/feed",
    website: "https://analisaaceh.com",
  },
  {
    name: "Portalsatu.com",
    province: "Aceh",
    rss: "https://portalsatu.com/feed",
    website: "https://portalsatu.com",
  },
  {
    name: "AJNN.net",
    province: "Aceh",
    rss: "https://www.ajnn.net/feed",
    website: "https://www.ajnn.net",
  },
  {
    name: "Komparatif.id",
    province: "Aceh",
    rss: "https://komparatif.id/feed",
    website: "https://komparatif.id",
  },
  {
    name: "AcehEkspres.com",
    province: "Aceh",
    rss: "https://acehekspres.com/feed",
    website: "https://acehekspres.com",
  },
  {
    name: "HabaNusantara.net",
    province: "Aceh",
    rss: "https://habanusantara.net/feed",
    website: "https://habanusantara.net",
  },
  {
    name: "SinarPidie.com",
    province: "Aceh",
    rss: "https://sinarpidie.com/feed",
    website: "https://sinarpidie.com",
  },
  {
    name: "MediaSatuNews.com",
    province: "Aceh",
    rss: "https://mediasatunews.com/feed",
    website: "https://mediasatunews.com",
  },
  {
    name: "NOA.co.id",
    province: "Aceh",
    rss: "https://noa.co.id/feed",
    website: "https://noa.co.id",
  },
  {
    name: "KabarBireuen.com",
    province: "Aceh",
    rss: "https://kabarbireuen.com/feed",
    website: "https://kabarbireuen.com",
  },
  {
    name: "HabaAceh.id",
    province: "Aceh",
    rss: "https://habaaceh.id/feed",
    website: "https://habaaceh.id",
  },
  {
    name: "Bithe.co",
    province: "Aceh",
    rss: "https://bithe.co/feed",
    website: "https://bithe.co",
  },
  {
    name: "Nukilan.id",
    province: "Aceh",
    rss: "https://nukilan.id/feed",
    website: "https://nukilan.id",
  },
  {
    name: "Pintoe.co",
    province: "Aceh",
    rss: "https://pintoe.co/feed",
    website: "https://pintoe.co",
  },
  {
    name: "KanalInspirasi.com",
    province: "Aceh",
    rss: "https://kanalinspirasi.com/feed",
    website: "https://kanalinspirasi.com",
  },
  {
    name: "IndoJayaNews.com",
    province: "Aceh",
    rss: "https://indojayanews.com/feed",
    website: "https://indojayanews.com",
  },
  {
    name: "HarianDaerah.com",
    province: "Aceh",
    rss: "https://hariandaerah.com/feed",
    website: "https://hariandaerah.com",
  },
  {
    name: "Serambi News",
    province: "Aceh",
    rss: "https://serambinews.com/feed",
    website: "https://serambinews.com",
  },
  {
    name: "SagoeTV.com",
    province: "Aceh",
    rss: "https://sagoetv.com/feed",
    website: "https://sagoetv.com",
  },
  {
    name: "RmolAceh.id",
    province: "Aceh",
    rss: "https://rmolaceh.id/feed",
    website: "https://rmolaceh.id",
  },
  {
    name: "Liputanesia.co.id",
    province: "Aceh",
    rss: "https://liputanesia.co.id/feed",
    website: "https://liputanesia.co.id",
  },
  {
    name: "Dialeksis.com",
    province: "Aceh",
    rss: "https://dialeksis.com/feed",
    website: "https://dialeksis.com",
  },
  {
    name: "Popularitas.com",
    province: "Aceh",
    rss: "https://popularitas.com/feed",
    website: "https://popularitas.com",
  },
  {
    name: "WaspadaAceh.com",
    province: "Aceh",
    rss: "https://waspadaaceh.com/feed",
    website: "https://waspadaaceh.com",
  },
  {
    name: "PenaPost.co.id",
    province: "Aceh",
    rss: "https://penapost.co.id/feed",
    website: "https://penapost.co.id",
  },
  {
    name: "Metropolis.id",
    province: "Aceh",
    rss: "https://metropolis.id/feed",
    website: "https://metropolis.id",
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
