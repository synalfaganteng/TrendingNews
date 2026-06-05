/**
 * Daftar sumber berita terverifikasi Dewan Pers
 * Provinsi: Sumatera Utara, Aceh, Sumatera Barat, Riau, Kepulauan Riau
 * Status: Terverifikasi Faktual
 * Jenis: Media Siber
 *
 * PENTING: Berita yang ditampilkan hanya yang relevan dengan
 * wilayah Sumatera Utara (8 kota + 25 kabupaten).
 * Berita dari portal lain provinsi tetap diambil, tapi di-filter.
 */

export const MEDIA_SOURCES = [
  // === SUMATERA UTARA (56 portal) ===
  { name: "GoSumut.com", rss: "https://gosumut.com/feed", website: "https://gosumut.com", province: "Sumatera Utara" },
  { name: "KabarMedan.com", rss: "https://kabarmedan.com/feed", website: "https://kabarmedan.com", province: "Sumatera Utara" },
  { name: "RmolSumut.id", rss: "https://rmolsumut.id/feed", website: "https://rmolsumut.id", province: "Sumatera Utara" },
  { name: "MedanMerdeka.com", rss: "https://medanmerdeka.com/feed", website: "https://medanmerdeka.com", province: "Sumatera Utara" },
  { name: "Digtara.com", rss: "https://digtara.com/feed", website: "https://digtara.com", province: "Sumatera Utara" },
  { name: "Intipos.com", rss: "https://intipos.com/feed", website: "https://intipos.com", province: "Sumatera Utara" },
  { name: "MedanPosOnline.com", rss: "https://medanposonline.com/feed", website: "https://medanposonline.com", province: "Sumatera Utara" },
  { name: "MediaSelektif.com", rss: "https://mediaselektif.com/feed", website: "https://mediaselektif.com", province: "Sumatera Utara" },
  { name: "LintasMedan.com", rss: "https://lintasmedan.com/feed", website: "https://lintasmedan.com", province: "Sumatera Utara" },
  { name: "MediaApakabar.com", rss: "https://mediaapakabar.com/feed", website: "https://mediaapakabar.com", province: "Sumatera Utara" },
  { name: "Viral24.co.id", rss: "https://viral24.co.id/feed", website: "https://viral24.co.id", province: "Sumatera Utara" },
  { name: "MimbarUmum.co.id", rss: "https://mimbarumum.co.id/feed", website: "https://mimbarumum.co.id", province: "Sumatera Utara" },
  { name: "IniMedan.com", rss: "https://inimedan.com/feed", website: "https://inimedan.com", province: "Sumatera Utara" },
  { name: "Asarpua.com", rss: "https://asarpua.com/feed", website: "https://asarpua.com", province: "Sumatera Utara" },
  { name: "TobaSatu.com", rss: "https://tobasatu.com/feed", website: "https://tobasatu.com", province: "Sumatera Utara" },
  { name: "MediaSumutku.com", rss: "https://mediasumutku.com/feed", website: "https://mediasumutku.com", province: "Sumatera Utara" },
  { name: "Sumut24.co", rss: "https://sumut24.co/feed", website: "https://sumut24.co", province: "Sumatera Utara" },
  { name: "KoranMedan.online", rss: "https://koranmedan.online/feed", website: "https://koranmedan.online", province: "Sumatera Utara" },
  { name: "AnalisaDaily.com", rss: "https://analisadaily.com/feed", website: "https://analisadaily.com", province: "Sumatera Utara" },
  { name: "MataBangsa.com", rss: "https://matabangsa.com/feed", website: "https://matabangsa.com", province: "Sumatera Utara" },
  { name: "MembaraNews.com", rss: "https://membaranews.com/feed", website: "https://membaranews.com", province: "Sumatera Utara" },
  { name: "OkeMedan.com", rss: "https://okemedan.com/feed", website: "https://okemedan.com", province: "Sumatera Utara" },
  { name: "IntipNews.com", rss: "https://intipnews.com/feed", website: "https://intipnews.com", province: "Sumatera Utara" },
  { name: "Metro-Online.co", rss: "https://metro-online.co/feed", website: "https://metro-online.co", province: "Sumatera Utara" },
  { name: "Pewarta.co", rss: "https://pewarta.co/feed", website: "https://pewarta.co", province: "Sumatera Utara" },
  { name: "BuanaPagi.com", rss: "https://buanapagi.com/feed", website: "https://buanapagi.com", province: "Sumatera Utara" },
  { name: "MitaNews.co.id", rss: "https://mitanews.co.id/feed", website: "https://mitanews.co.id", province: "Sumatera Utara" },
  { name: "MataTelinga.com", rss: "https://matatelinga.com/feed", website: "https://matatelinga.com", province: "Sumatera Utara" },
  { name: "Teritorial24.com", rss: "https://teritorial24.com/feed", website: "https://teritorial24.com", province: "Sumatera Utara" },
  { name: "KlikMetro.com", rss: "https://klikmetro.com/feed", website: "https://klikmetro.com", province: "Sumatera Utara" },
  { name: "BeritaNusa.com", rss: "https://beritanusa.com/feed", website: "https://beritanusa.com", province: "Sumatera Utara" },
  { name: "EksisNews.com", rss: "https://eksisnews.com/feed", website: "https://eksisnews.com", province: "Sumatera Utara" },
  { name: "Mistar.id", rss: "https://mistar.id/feed", website: "https://mistar.id", province: "Sumatera Utara" },
  { name: "InilahMedan.com", rss: "https://inilahmedan.com/feed", website: "https://inilahmedan.com", province: "Sumatera Utara" },
  { name: "SentralBerita.com", rss: "https://sentralberita.com/feed", website: "https://sentralberita.com", province: "Sumatera Utara" },
  { name: "InformasiTerpercaya.com", rss: "https://informasiterpercaya.com/feed", website: "https://informasiterpercaya.com", province: "Sumatera Utara" },
  { name: "MimbarOnline.com", rss: "https://mimbaronline.com/feed", website: "https://mimbaronline.com", province: "Sumatera Utara" },
  { name: "HarianSIB.com", rss: "https://hariansib.com/feed", website: "https://hariansib.com", province: "Sumatera Utara" },
  { name: "MetroDaily (JawaPos)", rss: "https://metrodaily.jawapos.com/feed", website: "https://metrodaily.jawapos.com", province: "Sumatera Utara" },
  { name: "NusantaraTerkini.co", rss: "https://nusantaraterkini.co/feed", website: "https://nusantaraterkini.co", province: "Sumatera Utara" },
  { name: "KitaKini.news", rss: "https://kitakini.news/feed", website: "https://kitakini.news", province: "Sumatera Utara" },
  { name: "OrbitDigitalDaily.com", rss: "https://orbitdigitaldaily.com/feed", website: "https://orbitdigitaldaily.com", province: "Sumatera Utara" },
  { name: "WartaLive.co.id", rss: "https://wartalive.co.id/feed", website: "https://wartalive.co.id", province: "Sumatera Utara" },
  { name: "BitvOnline.com", rss: "https://bitvonline.com/feed", website: "https://bitvonline.com", province: "Sumatera Utara" },
  { name: "Waspada.id", rss: "https://waspada.id/feed", website: "https://waspada.id", province: "Sumatera Utara" },
  { name: "KlikSumut.com", rss: "https://kliksumut.com/feed", website: "https://kliksumut.com", province: "Sumatera Utara" },
  { name: "RealitasOnline.id", rss: "https://realitasonline.id/feed", website: "https://realitasonline.id", province: "Sumatera Utara" },
  { name: "MetroPublik.com", rss: "https://metropublik.com/feed", website: "https://metropublik.com", province: "Sumatera Utara" },
  { name: "TopMetro.news", rss: "https://topmetro.news/feed", website: "https://topmetro.news", province: "Sumatera Utara" },
  { name: "Sinata.id", rss: "https://sinata.id/feed", website: "https://sinata.id", province: "Sumatera Utara" },
  { name: "MetroRakyat.com", rss: "https://metrorakyat.com/feed", website: "https://metrorakyat.com", province: "Sumatera Utara" },
  { name: "Tribun Medan", rss: "https://medan.tribunnews.com/rss", website: "https://medan.tribunnews.com", province: "Sumatera Utara" },
  { name: "Waspada.co.id", rss: "https://waspada.co.id/feed", website: "https://waspada.co.id", province: "Sumatera Utara" },
  { name: "IniMedanBung.com", rss: "https://inimedanbung.com/feed", website: "https://inimedanbung.com", province: "Sumatera Utara" },

  // === ACEH (33 portal) ===
  { name: "Masakini.co", rss: "https://masakini.co/feed", website: "https://masakini.co", province: "Aceh" },
  { name: "KabarTamiang.com", rss: "https://kabartamiang.com/feed", website: "https://kabartamiang.com", province: "Aceh" },
  { name: "BeritaMerdeka.net", rss: "https://beritamerdeka.net/feed", website: "https://beritamerdeka.net", province: "Aceh" },
  { name: "AcehBisnis.com", rss: "https://acehbisnis.com/feed", website: "https://acehbisnis.com", province: "Aceh" },
  { name: "AnteroAceh.com", rss: "https://anteroaceh.com/feed", website: "https://anteroaceh.com", province: "Aceh" },
  { name: "AcehVideo.tv", rss: "https://acehvideo.tv/feed", website: "https://acehvideo.tv", province: "Aceh" },
  { name: "TheAcehPost.com", rss: "https://theacehpost.com/feed", website: "https://theacehpost.com", province: "Aceh" },
  { name: "AcehPortal.com", rss: "https://acehportal.com/feed", website: "https://acehportal.com", province: "Aceh" },
  { name: "AnalisaAceh.com", rss: "https://analisaaceh.com/feed", website: "https://analisaaceh.com", province: "Aceh" },
  { name: "Portalsatu.com", rss: "https://portalsatu.com/feed", website: "https://portalsatu.com", province: "Aceh" },
  { name: "AJNN.net", rss: "https://www.ajnn.net/feed", website: "https://www.ajnn.net", province: "Aceh" },
  { name: "Komparatif.id", rss: "https://komparatif.id/feed", website: "https://komparatif.id", province: "Aceh" },
  { name: "AcehEkspres.com", rss: "https://acehekspres.com/feed", website: "https://acehekspres.com", province: "Aceh" },
  { name: "HabaNusantara.net", rss: "https://habanusantara.net/feed", website: "https://habanusantara.net", province: "Aceh" },
  { name: "SinarPidie.com", rss: "https://sinarpidie.com/feed", website: "https://sinarpidie.com", province: "Aceh" },
  { name: "MediaSatuNews.com", rss: "https://mediasatunews.com/feed", website: "https://mediasatunews.com", province: "Aceh" },
  { name: "NOA.co.id", rss: "https://noa.co.id/feed", website: "https://noa.co.id", province: "Aceh" },
  { name: "KabarBireuen.com", rss: "https://kabarbireuen.com/feed", website: "https://kabarbireuen.com", province: "Aceh" },
  { name: "HabaAceh.id", rss: "https://habaaceh.id/feed", website: "https://habaaceh.id", province: "Aceh" },
  { name: "Bithe.co", rss: "https://bithe.co/feed", website: "https://bithe.co", province: "Aceh" },
  { name: "Nukilan.id", rss: "https://nukilan.id/feed", website: "https://nukilan.id", province: "Aceh" },
  { name: "Pintoe.co", rss: "https://pintoe.co/feed", website: "https://pintoe.co", province: "Aceh" },
  { name: "KanalInspirasi.com", rss: "https://kanalinspirasi.com/feed", website: "https://kanalinspirasi.com", province: "Aceh" },
  { name: "IndoJayaNews.com", rss: "https://indojayanews.com/feed", website: "https://indojayanews.com", province: "Aceh" },
  { name: "HarianDaerah.com", rss: "https://hariandaerah.com/feed", website: "https://hariandaerah.com", province: "Aceh" },
  { name: "Serambi News", rss: "https://serambinews.com/feed", website: "https://serambinews.com", province: "Aceh" },
  { name: "SagoeTV.com", rss: "https://sagoetv.com/feed", website: "https://sagoetv.com", province: "Aceh" },
  { name: "RmolAceh.id", rss: "https://rmolaceh.id/feed", website: "https://rmolaceh.id", province: "Aceh" },
  { name: "Liputanesia.co.id", rss: "https://liputanesia.co.id/feed", website: "https://liputanesia.co.id", province: "Aceh" },
  { name: "Dialeksis.com", rss: "https://dialeksis.com/feed", website: "https://dialeksis.com", province: "Aceh" },
  { name: "Popularitas.com", rss: "https://popularitas.com/feed", website: "https://popularitas.com", province: "Aceh" },
  { name: "WaspadaAceh.com", rss: "https://waspadaaceh.com/feed", website: "https://waspadaaceh.com", province: "Aceh" },
  { name: "PenaPost.co.id", rss: "https://penapost.co.id/feed", website: "https://penapost.co.id", province: "Aceh" },
  { name: "Metropolis.id", rss: "https://metropolis.id/feed", website: "https://metropolis.id", province: "Aceh" },

  // === SUMATERA BARAT ===
  { name: "Harianhaluan", rss: "https://harianhaluan.com/feed", website: "https://harianhaluan.com", province: "Sumatera Barat" },
  { name: "Langgam.id", rss: "https://langgam.id/feed", website: "https://langgam.id", province: "Sumatera Barat" },
  { name: "Tribun Padang", rss: "https://padang.tribunnews.com/rss", website: "https://padang.tribunnews.com", province: "Sumatera Barat" },
  { name: "Covesia", rss: "https://covesia.com/feed", website: "https://covesia.com", province: "Sumatera Barat" },

  // === RIAU ===
  { name: "Tribun Pekanbaru", rss: "https://pekanbaru.tribunnews.com/rss", website: "https://pekanbaru.tribunnews.com", province: "Riau" },
  { name: "GoRiau", rss: "https://goriau.com/feed", website: "https://goriau.com", province: "Riau" },
  { name: "Riaupos", rss: "https://riaupos.jawapos.com/feed", website: "https://riaupos.jawapos.com", province: "Riau" },
  { name: "Cakaplah", rss: "https://www.cakaplah.com/feed", website: "https://www.cakaplah.com", province: "Riau" },

  // === KEPULAUAN RIAU ===
  { name: "Tribun Batam", rss: "https://batam.tribunnews.com/rss", website: "https://batam.tribunnews.com", province: "Kepulauan Riau" },
  { name: "Batampos", rss: "https://batampos.co.id/feed", website: "https://batampos.co.id", province: "Kepulauan Riau" },
  { name: "Sijoritoday", rss: "https://sijoritoday.com/feed", website: "https://sijoritoday.com", province: "Kepulauan Riau" },
];

// Google Trends RSS (Indonesia)
export const GOOGLE_TRENDS_RSS =
  "https://trends.google.co.id/trends/trendingsearches/daily/rss?geo=ID";

// Google News RSS — Sumatera Utara focused
export const GOOGLE_NEWS_FEEDS = [
  {
    label: "Sumatera Utara",
    rss: "https://news.google.com/rss/search?q=Sumatera+Utara&hl=id&gl=ID&ceid=ID:id",
  },
  {
    label: "Medan",
    rss: "https://news.google.com/rss/search?q=Medan+Sumatera+Utara&hl=id&gl=ID&ceid=ID:id",
  },
];

/**
 * Daftar Kota dan Kabupaten di Sumatera Utara
 * Berita HANYA ditampilkan jika:
 * 1. Berasal dari portal Sumatera Utara (auto-lolos), ATAU
 * 2. Menyebut salah satu kota/kabupaten ini di judul/konten
 *
 * Berita dari Jakarta, internasional, dll → DIBUANG
 */
export const KOTA = [
  "Medan",
  "Binjai",
  "Gunungsitoli",
  "Padangsidimpuan",
  "Pematangsiantar",
  "Sibolga",
  "Tanjungbalai",
  "Tebing Tinggi",
];

export const KABUPATEN = [
  "Asahan",
  "Batu Bara",
  "Dairi",
  "Deli Serdang",
  "Humbang Hasundutan",
  "Karo",
  "Labuhanbatu",
  "Labuhanbatu Selatan",
  "Labuhanbatu Utara",
  "Langkat",
  "Mandailing Natal",
  "Nias",
  "Nias Barat",
  "Nias Selatan",
  "Nias Utara",
  "Padang Lawas",
  "Padang Lawas Utara",
  "Pakpak Bharat",
  "Samosir",
  "Serdang Bedagai",
  "Simalungun",
  "Tapanuli Selatan",
  "Tapanuli Tengah",
  "Tapanuli Utara",
  "Toba",
];

// Gabungan semua wilayah + keyword Sumut (untuk region detection)
export const ALL_REGIONS = [...KOTA, ...KABUPATEN];

// Keywords yang menandakan berita relevan Sumatera Utara
export const SUMUT_KEYWORDS = [
  ...ALL_REGIONS,
  "Sumatera Utara",
  "Sumut",
  "Sumatra Utara",
  "North Sumatra",
  "Danau Toba",
  "Bukit Lawang",
  "Berastagi",
  "Parapat",
  "Prapat",
  "Sidikalang",
  "Kisaran",
  "Rantauprapat",
  "Balige",
  "Tarutung",
  "Panyabungan",
  "Stabat",
  "Lubukpakam",
  "Sei Rampah",
  "Pangururan",
  "Doloksanggul",
  "Gunung Sitoli",
];
