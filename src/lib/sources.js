/**
 * Daftar sumber berita terverifikasi Dewan Pers
 * Provinsi: Sumatera Utara, Aceh, Sumatera Barat, Riau, Kepulauan Riau
 * Status: Terverifikasi Faktual
 * Jenis: Media Siber
 *
 * Setiap provinsi punya daftar kota/kabupaten.
 * Berita hanya ditampilkan jika menyebut wilayah provinsi yang sudah dipetakan.
 */

export const MEDIA_SOURCES = [
  // === SUMATERA UTARA (54 portal) ===
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

  // === SUMATERA BARAT (20 portal) ===
  { name: "KabarSumbar.com", rss: "https://kabarsumbar.com/feed", website: "https://kabarsumbar.com", province: "Sumatera Barat" },
  { name: "TopSumbar.co.id", rss: "https://topsumbar.co.id/feed", website: "https://topsumbar.co.id", province: "Sumatera Barat" },
  { name: "EkspresNews.com", rss: "https://ekspresnews.com/feed", website: "https://ekspresnews.com", province: "Sumatera Barat" },
  { name: "MentawaiKita.com", rss: "https://mentawaikita.com/feed", website: "https://mentawaikita.com", province: "Sumatera Barat" },
  { name: "FigurNews.com", rss: "https://figurnews.com/feed", website: "https://figurnews.com", province: "Sumatera Barat" },
  { name: "MajalahIntrust.com", rss: "https://majalahintrust.com/feed", website: "https://majalahintrust.com", province: "Sumatera Barat" },
  { name: "Scientia.id", rss: "https://scientia.id/feed", website: "https://scientia.id", province: "Sumatera Barat" },
  { name: "PadangMedia.com", rss: "https://padangmedia.com/feed", website: "https://padangmedia.com", province: "Sumatera Barat" },
  { name: "MinangkabauNews.com", rss: "https://minangkabaunews.com/feed", website: "https://minangkabaunews.com", province: "Sumatera Barat" },
  { name: "ValoraNews.com", rss: "https://valoranews.com/feed", website: "https://valoranews.com", province: "Sumatera Barat" },
  { name: "FajarHarapan.id", rss: "https://fajarharapan.id/feed", website: "https://fajarharapan.id", province: "Sumatera Barat" },
  { name: "MjNews.id", rss: "https://mjnews.id/feed", website: "https://mjnews.id", province: "Sumatera Barat" },
  { name: "LiputanKini.com", rss: "https://liputankini.com/feed", website: "https://liputankini.com", province: "Sumatera Barat" },
  { name: "Tribun Padang", rss: "https://padang.tribunnews.com/rss", website: "https://padang.tribunnews.com", province: "Sumatera Barat" },
  { name: "Investigasi.news", rss: "https://investigasi.news/feed", website: "https://investigasi.news", province: "Sumatera Barat" },
  { name: "ReportaseInvestigasi.com", rss: "https://reportaseinvestigasi.com/feed", website: "https://reportaseinvestigasi.com", province: "Sumatera Barat" },
  { name: "DutaMetro.com", rss: "https://dutametro.com/feed", website: "https://dutametro.com", province: "Sumatera Barat" },
  { name: "KupasOnline.com", rss: "https://kupasonline.com/feed", website: "https://kupasonline.com", province: "Sumatera Barat" },
  { name: "SemangatNews.com", rss: "https://semangatnews.com/feed", website: "https://semangatnews.com", province: "Sumatera Barat" },
  { name: "RakyatTerkini.com", rss: "https://rakyatterkini.com/feed", website: "https://rakyatterkini.com", province: "Sumatera Barat" },
  { name: "FajarSumbar.com", rss: "https://fajarsumbar.com/feed", website: "https://fajarsumbar.com", province: "Sumatera Barat" },
  { name: "KlikPositif.com", rss: "https://klikpositif.com/feed", website: "https://klikpositif.com", province: "Sumatera Barat" },
  { name: "BentengSumbar.com", rss: "https://bentengsumbar.com/feed", website: "https://bentengsumbar.com", province: "Sumatera Barat" },
  { name: "TopSatu.com", rss: "https://topsatu.com/feed", website: "https://topsatu.com", province: "Sumatera Barat" },

  // === RIAU (23 portal) ===
  { name: "RiauMandiri.co", rss: "https://riaumandiri.co/feed", website: "https://riaumandiri.co", province: "Riau" },
  { name: "Riau1.com", rss: "https://riau1.com/feed", website: "https://riau1.com", province: "Riau" },
  { name: "RiauBISA.com", rss: "https://riaubisa.com/feed", website: "https://riaubisa.com", province: "Riau" },
  { name: "BeritaRiau.com", rss: "https://beritariau.com/feed", website: "https://beritariau.com", province: "Riau" },
  { name: "BerkabarNews.com", rss: "https://berkabarnews.com/feed", website: "https://berkabarnews.com", province: "Riau" },
  { name: "LiputanOke.com", rss: "https://liputanoke.com/feed", website: "https://liputanoke.com", province: "Riau" },
  { name: "DumaiPosNews.com", rss: "https://dumaiposnews.com/feed", website: "https://dumaiposnews.com", province: "Riau" },
  { name: "SegmenNews.com", rss: "https://segmennews.com/feed", website: "https://segmennews.com", province: "Riau" },
  { name: "MonitorRiau.com", rss: "https://monitorriau.com/feed", website: "https://monitorriau.com", province: "Riau" },
  { name: "CeriaTV.co.id", rss: "https://ceriatv.co.id/feed", website: "https://ceriatv.co.id", province: "Riau" },
  { name: "IndragiriOne.com", rss: "https://indragirione.com/feed", website: "https://indragirione.com", province: "Riau" },
  { name: "RiauPos.co", rss: "https://riaupos.co/feed", website: "https://riaupos.co", province: "Riau" },
  { name: "RiauAktual.com", rss: "https://riauaktual.com/feed", website: "https://riauaktual.com", province: "Riau" },
  { name: "NadaRiau.com", rss: "https://nadariau.com/feed", website: "https://nadariau.com", province: "Riau" },
  { name: "RiauIn.com", rss: "https://riauin.com/feed", website: "https://riauin.com", province: "Riau" },
  { name: "Cakaplah.com", rss: "https://cakaplah.com/feed", website: "https://cakaplah.com", province: "Riau" },
  { name: "Riau24.com", rss: "https://riau24.com/feed", website: "https://riau24.com", province: "Riau" },
  { name: "GoRiau.com", rss: "https://goriau.com/feed", website: "https://goriau.com", province: "Riau" },
  { name: "HalloRiau.com", rss: "https://halloriau.com/feed", website: "https://halloriau.com", province: "Riau" },
  { name: "SiagaOnline.com", rss: "https://siagaonline.com/feed", website: "https://siagaonline.com", province: "Riau" },
  { name: "RiauOnline.co.id", rss: "https://riauonline.co.id/feed", website: "https://riauonline.co.id", province: "Riau" },
  { name: "IniRiau.com", rss: "https://iniriau.com/feed", website: "https://iniriau.com", province: "Riau" },
  { name: "Tribun Pekanbaru", rss: "https://pekanbaru.tribunnews.com/rss", website: "https://pekanbaru.tribunnews.com", province: "Riau" },

  // === KEPULAUAN RIAU (70 portal) ===
  { name: "BatamNow.com", rss: "https://batamnow.com/feed", website: "https://batamnow.com", province: "Kepulauan Riau" },
  { name: "SuaraSiber.com", rss: "https://suarasiber.com/feed", website: "https://suarasiber.com", province: "Kepulauan Riau" },
  { name: "SuaraBatam.com", rss: "https://suarabatam.com/feed", website: "https://suarabatam.com", province: "Kepulauan Riau" },
  { name: "KoranPerbatasan.com", rss: "https://koranperbatasan.com/feed", website: "https://koranperbatasan.com", province: "Kepulauan Riau" },
  { name: "AriraNews.com", rss: "https://ariranews.com/feed", website: "https://ariranews.com", province: "Kepulauan Riau" },
  { name: "BursaKota.co.id", rss: "https://bursakota.co.id/feed", website: "https://bursakota.co.id", province: "Kepulauan Riau" },
  { name: "KepriGlobal.com", rss: "https://kepriglobal.com/feed", website: "https://kepriglobal.com", province: "Kepulauan Riau" },
  { name: "AciKepri.com", rss: "https://acikepri.com/feed", website: "https://acikepri.com", province: "Kepulauan Riau" },
  { name: "AlurNews.com", rss: "https://alurnews.com/feed", website: "https://alurnews.com", province: "Kepulauan Riau" },
  { name: "IndependenNews.com", rss: "https://independennews.com/feed", website: "https://independennews.com", province: "Kepulauan Riau" },
  { name: "OwnTalk.co.id", rss: "https://owntalk.co.id/feed", website: "https://owntalk.co.id", province: "Kepulauan Riau" },
  { name: "WahanaIndoNews.com", rss: "https://wahanaindonews.com/feed", website: "https://wahanaindonews.com", province: "Kepulauan Riau" },
  { name: "DetikGlobalNews.com", rss: "https://detikglobalnews.com/feed", website: "https://detikglobalnews.com", province: "Kepulauan Riau" },
  { name: "BeritaBatam.com", rss: "https://beritabatam.com/feed", website: "https://beritabatam.com", province: "Kepulauan Riau" },
  { name: "HarianMetropolitan.co.id", rss: "https://harianmetropolitan.co.id/feed", website: "https://harianmetropolitan.co.id", province: "Kepulauan Riau" },
  { name: "NatindoNews.com", rss: "https://natindonews.com/feed", website: "https://natindonews.com", province: "Kepulauan Riau" },
  { name: "GoKepri.com", rss: "https://gokepri.com/feed", website: "https://gokepri.com", province: "Kepulauan Riau" },
  { name: "MetroIndonesia.co.id", rss: "https://metroindonesia.co.id/feed", website: "https://metroindonesia.co.id", province: "Kepulauan Riau" },
  { name: "RanaiPos.com", rss: "https://ranaipos.com/feed", website: "https://ranaipos.com", province: "Kepulauan Riau" },
  { name: "Terdepan.co.id", rss: "https://terdepan.co.id/feed", website: "https://terdepan.co.id", province: "Kepulauan Riau" },
  { name: "HarianKepri.com", rss: "https://hariankepri.com/feed", website: "https://hariankepri.com", province: "Kepulauan Riau" },
  { name: "SuaraSerumpun.com", rss: "https://suaraserumpun.com/feed", website: "https://suaraserumpun.com", province: "Kepulauan Riau" },
  { name: "KepriPos.id", rss: "https://kepripos.id/feed", website: "https://kepripos.id", province: "Kepulauan Riau" },
  { name: "KepriBetter.com", rss: "https://kepribetter.com/feed", website: "https://kepribetter.com", province: "Kepulauan Riau" },
  { name: "JalurNews.com", rss: "https://jalurnews.com/feed", website: "https://jalurnews.com", province: "Kepulauan Riau" },
  { name: "InfoKepri.com", rss: "https://infokepri.com/feed", website: "https://infokepri.com", province: "Kepulauan Riau" },
  { name: "BatamInfo.co.id", rss: "https://bataminfo.co.id/feed", website: "https://bataminfo.co.id", province: "Kepulauan Riau" },
  { name: "MimbarPublik.com", rss: "https://mimbarpublik.com/feed", website: "https://mimbarpublik.com", province: "Kepulauan Riau" },
  { name: "MediaTrias.com", rss: "https://mediatrias.com/feed", website: "https://mediatrias.com", province: "Kepulauan Riau" },
  { name: "MetroBatam.com", rss: "https://metrobatam.com/feed", website: "https://metrobatam.com", province: "Kepulauan Riau" },
  { name: "HarianHaluanKepri.com", rss: "https://harianhaluankepri.com/feed", website: "https://harianhaluankepri.com", province: "Kepulauan Riau" },
  { name: "GoTVNews.co.id", rss: "https://gotvnews.co.id/feed", website: "https://gotvnews.co.id", province: "Kepulauan Riau" },
  { name: "Kutipan.co", rss: "https://kutipan.co/feed", website: "https://kutipan.co", province: "Kepulauan Riau" },
  { name: "TransKepri.com", rss: "https://transkepri.com/feed", website: "https://transkepri.com", province: "Kepulauan Riau" },
  { name: "J5Newsroom.com", rss: "https://j5newsroom.com/feed", website: "https://j5newsroom.com", province: "Kepulauan Riau" },
  { name: "SinarPerbatasan.com", rss: "https://sinarperbatasan.com/feed", website: "https://sinarperbatasan.com", province: "Kepulauan Riau" },
  { name: "Ulasan.co", rss: "https://ulasan.co/feed", website: "https://ulasan.co", province: "Kepulauan Riau" },
  { name: "AlreinaMedia.com", rss: "https://alreinamedia.com/feed", website: "https://alreinamedia.com", province: "Kepulauan Riau" },
  { name: "LintasKepri.com", rss: "https://lintaskepri.com/feed", website: "https://lintaskepri.com", province: "Kepulauan Riau" },
  { name: "JurnalTerkini.id", rss: "https://jurnalterkini.id/feed", website: "https://jurnalterkini.id", province: "Kepulauan Riau" },
  { name: "MediaNesia.id", rss: "https://medianesia.id/feed", website: "https://medianesia.id", province: "Kepulauan Riau" },
  { name: "HarianMemoKepri.com", rss: "https://harianmemokepri.com/feed", website: "https://harianmemokepri.com", province: "Kepulauan Riau" },
  { name: "Kepri.co.id", rss: "https://kepri.co.id/feed", website: "https://kepri.co.id", province: "Kepulauan Riau" },
  { name: "KepriNews.co", rss: "https://keprinews.co/feed", website: "https://keprinews.co", province: "Kepulauan Riau" },
  { name: "RadarSatu.com", rss: "https://radarsatu.com/feed", website: "https://radarsatu.com", province: "Kepulauan Riau" },
  { name: "DataKepri.com", rss: "https://datakepri.com/feed", website: "https://datakepri.com", province: "Kepulauan Riau" },
  { name: "VNews.click", rss: "https://vnews.click/feed", website: "https://vnews.click", province: "Kepulauan Riau" },
  { name: "Batampos.co.id", rss: "https://batampos.co.id/feed", website: "https://batampos.co.id", province: "Kepulauan Riau" },
  { name: "KepriPedia.com", rss: "https://kepripedia.com/feed", website: "https://kepripedia.com", province: "Kepulauan Riau" },
  { name: "TerkiniNews.com", rss: "https://terkininews.com/feed", website: "https://terkininews.com", province: "Kepulauan Riau" },
  { name: "GebrakNews.co.id", rss: "https://gebraknews.co.id/feed", website: "https://gebraknews.co.id", province: "Kepulauan Riau" },
  { name: "BatamClick.com", rss: "https://batamclick.com/feed", website: "https://batamclick.com", province: "Kepulauan Riau" },
  { name: "ProBatam.co", rss: "https://probatam.co/feed", website: "https://probatam.co", province: "Kepulauan Riau" },
  { name: "KabarTerkini.co.id", rss: "https://kabarterkini.co.id/feed", website: "https://kabarterkini.co.id", province: "Kepulauan Riau" },
  { name: "Durasi.co.id", rss: "https://durasi.co.id/feed", website: "https://durasi.co.id", province: "Kepulauan Riau" },
  { name: "Rasio.co", rss: "https://rasio.co/feed", website: "https://rasio.co", province: "Kepulauan Riau" },
  { name: "BatamNews.co.id", rss: "https://batamnews.co.id/feed", website: "https://batamnews.co.id", province: "Kepulauan Riau" },
  { name: "DeltaKepri.co.id", rss: "https://deltakepri.co.id/feed", website: "https://deltakepri.co.id", province: "Kepulauan Riau" },
  { name: "CentralNews.id", rss: "https://centralnews.id/feed", website: "https://centralnews.id", province: "Kepulauan Riau" },
  { name: "MandalaPos.co.id", rss: "https://mandalapos.co.id/feed", website: "https://mandalapos.co.id", province: "Kepulauan Riau" },
  { name: "PosMetro.co", rss: "https://posmetro.co/feed", website: "https://posmetro.co", province: "Kepulauan Riau" },
  { name: "IGNNews.id", rss: "https://ignnews.id/feed", website: "https://ignnews.id", province: "Kepulauan Riau" },
  { name: "MarwahKepri.com", rss: "https://marwahkepri.com/feed", website: "https://marwahkepri.com", province: "Kepulauan Riau" },
  { name: "KepriDays.co.id", rss: "https://kepridays.co.id/feed", website: "https://kepridays.co.id", province: "Kepulauan Riau" },
  { name: "HMSTimes.com", rss: "https://hmstimes.com/feed", website: "https://hmstimes.com", province: "Kepulauan Riau" },
  { name: "Tribun Batam", rss: "https://batam.tribunnews.com/rss", website: "https://batam.tribunnews.com", province: "Kepulauan Riau" },
  { name: "PojokBatam.id", rss: "https://pojokbatam.id/feed", website: "https://pojokbatam.id", province: "Kepulauan Riau" },
  { name: "SilabusKepri.co.id", rss: "https://silabuskepri.co.id/feed", website: "https://silabuskepri.co.id", province: "Kepulauan Riau" },
];

// Google Trends RSS (Indonesia)
export const GOOGLE_TRENDS_RSS =
  "https://trends.google.co.id/trends/trendingsearches/daily/rss?geo=ID";

// Google News RSS — per province
export const GOOGLE_NEWS_FEEDS = [
  { label: "Sumatera Utara", rss: "https://news.google.com/rss/search?q=Sumatera+Utara&hl=id&gl=ID&ceid=ID:id" },
  { label: "Medan", rss: "https://news.google.com/rss/search?q=Medan+Sumatera+Utara&hl=id&gl=ID&ceid=ID:id" },
  { label: "Aceh", rss: "https://news.google.com/rss/search?q=Aceh&hl=id&gl=ID&ceid=ID:id" },
  { label: "Sumatera Barat", rss: "https://news.google.com/rss/search?q=Sumatera+Barat&hl=id&gl=ID&ceid=ID:id" },
  { label: "Riau", rss: "https://news.google.com/rss/search?q=Riau&hl=id&gl=ID&ceid=ID:id" },
  { label: "Kepulauan Riau", rss: "https://news.google.com/rss/search?q=Kepulauan+Riau+Batam&hl=id&gl=ID&ceid=ID:id" },
];

/**
 * =====================================================
 * WILAYAH PER PROVINSI
 * Berita hanya lolos jika menyebut wilayah di bawah ini.
 * =====================================================
 */

// --- SUMATERA UTARA ---
export const SUMUT_KOTA = [
  "Medan", "Binjai", "Gunungsitoli", "Padangsidimpuan",
  "Pematangsiantar", "Sibolga", "Tanjungbalai", "Tebing Tinggi",
];
export const SUMUT_KABUPATEN = [
  "Asahan", "Batu Bara", "Dairi", "Deli Serdang", "Humbang Hasundutan",
  "Karo", "Labuhanbatu", "Labuhanbatu Selatan", "Labuhanbatu Utara",
  "Langkat", "Mandailing Natal", "Nias", "Nias Barat", "Nias Selatan",
  "Nias Utara", "Padang Lawas", "Padang Lawas Utara", "Pakpak Bharat",
  "Samosir", "Serdang Bedagai", "Simalungun", "Tapanuli Selatan",
  "Tapanuli Tengah", "Tapanuli Utara", "Toba",
];
export const SUMUT_EXTRA_KEYWORDS = [
  "Sumatera Utara", "Sumut", "Sumatra Utara", "North Sumatra",
  "Danau Toba", "Bukit Lawang", "Berastagi", "Parapat", "Prapat",
  "Sidikalang", "Kisaran", "Rantauprapat", "Balige", "Tarutung",
  "Panyabungan", "Stabat", "Lubukpakam", "Sei Rampah", "Pangururan",
  "Doloksanggul", "Gunung Sitoli",
];

// --- ACEH ---
export const ACEH_KOTA = [
  "Banda Aceh", "Langsa", "Lhokseumawe", "Sabang", "Subulussalam",
];
export const ACEH_KABUPATEN = [
  "Aceh Barat", "Aceh Barat Daya", "Aceh Besar", "Aceh Jaya",
  "Aceh Selatan", "Aceh Singkil", "Aceh Tamiang", "Aceh Tengah",
  "Aceh Tenggara", "Aceh Timur", "Aceh Utara", "Bener Meriah",
  "Bireuen", "Gayo Lues", "Nagan Raya", "Pidie", "Pidie Jaya", "Simeulue",
];
export const ACEH_EXTRA_KEYWORDS = [
  "Aceh", "NAD", "Nanggroe Aceh", "Serambi Mekkah",
  "Meulaboh", "Takengon", "Blangkejeren", "Kutacane",
  "Calang", "Tapaktuan", "Sinabang", "Singkil",
];

// --- SUMATERA BARAT ---
export const SUMBAR_KOTA = [
  "Padang", "Bukittinggi", "Padang Panjang", "Pariaman",
  "Payakumbuh", "Sawahlunto", "Solok",
];
export const SUMBAR_KABUPATEN = [
  "Agam", "Dharmasraya", "Kepulauan Mentawai", "Lima Puluh Kota",
  "Padang Pariaman", "Pasaman", "Pasaman Barat", "Pesisir Selatan",
  "Sijunjung", "Solok", "Solok Selatan", "Tanah Datar",
];
export const SUMBAR_EXTRA_KEYWORDS = [
  "Sumatera Barat", "Sumbar", "Sumatra Barat", "West Sumatra",
  "Minangkabau", "Minang", "Ranah Minang", "Batusangkar",
  "Lubuk Basung", "Painan", "Muaro Sijunjung", "Tua Pejat",
  "Simpang Empat", "Arosuka",
];

// --- RIAU ---
export const RIAU_KOTA = [
  "Pekanbaru", "Dumai",
];
export const RIAU_KABUPATEN = [
  "Bengkalis", "Indragiri Hilir", "Indragiri Hulu", "Kampar",
  "Kepulauan Meranti", "Kuantan Singingi", "Pelalawan",
  "Rokan Hilir", "Rokan Hulu", "Siak",
];
export const RIAU_EXTRA_KEYWORDS = [
  "Riau", "Provinsi Riau", "Tembilahan", "Rengat", "Bangkinang",
  "Selat Panjang", "Bagan Siapi-api", "Pasir Pangaraian",
  "Pangkalan Kerinci", "Siak Sri Indrapura", "Teluk Kuantan",
];

// --- KEPULAUAN RIAU ---
export const KEPRI_KOTA = [
  "Tanjungpinang", "Batam",
];
export const KEPRI_KABUPATEN = [
  "Bintan", "Karimun", "Kepulauan Anambas", "Lingga", "Natuna",
];
export const KEPRI_EXTRA_KEYWORDS = [
  "Kepulauan Riau", "Kepri", "Batam", "Tanjung Pinang",
  "Ranai", "Daik", "Tarempa", "Tanjung Balai Karimun",
  "Dabo Singkep", "Kijang",
];

/**
 * Gabungan keyword per provinsi
 * Digunakan di region-filter.js
 */
export const PROVINCE_REGIONS = {
  "Sumatera Utara": [...SUMUT_KOTA, ...SUMUT_KABUPATEN, ...SUMUT_EXTRA_KEYWORDS],
  "Aceh": [...ACEH_KOTA, ...ACEH_KABUPATEN, ...ACEH_EXTRA_KEYWORDS],
  "Sumatera Barat": [...SUMBAR_KOTA, ...SUMBAR_KABUPATEN, ...SUMBAR_EXTRA_KEYWORDS],
  "Riau": [...RIAU_KOTA, ...RIAU_KABUPATEN, ...RIAU_EXTRA_KEYWORDS],
  "Kepulauan Riau": [...KEPRI_KOTA, ...KEPRI_KABUPATEN, ...KEPRI_EXTRA_KEYWORDS],
};

// ALL_REGIONS: semua kota/kabupaten dari semua provinsi yang sudah dipetakan
export const ALL_REGIONS = [
  ...SUMUT_KOTA, ...SUMUT_KABUPATEN,
  ...ACEH_KOTA, ...ACEH_KABUPATEN,
  ...SUMBAR_KOTA, ...SUMBAR_KABUPATEN,
  ...RIAU_KOTA, ...RIAU_KABUPATEN,
  ...KEPRI_KOTA, ...KEPRI_KABUPATEN,
];

// Semua keyword valid (berita harus menyebut salah satu dari ini)
export const ALL_VALID_KEYWORDS = [
  ...PROVINCE_REGIONS["Sumatera Utara"],
  ...PROVINCE_REGIONS["Aceh"],
  ...PROVINCE_REGIONS["Sumatera Barat"],
  ...PROVINCE_REGIONS["Riau"],
  ...PROVINCE_REGIONS["Kepulauan Riau"],
];
