# Trending Sumatera 🔥

Aggregator berita **real-time** dari media terverifikasi Dewan Pers untuk wilayah Sumatera (Sumatera Utara, Aceh, Sumatera Barat, Riau, Kepulauan Riau).

## Fitur

- 📰 Agregasi berita dari 23+ media siber terverifikasi faktual
- 🔥 Google Trends Indonesia (trending searches)
- 🌐 Google News regional filter
- ⏱️ Filter otomatis: hanya berita **3 jam terakhir**
- 🔄 Auto-refresh setiap 30 detik
- 🏷️ Filter per provinsi
- 📱 Responsive (mobile-friendly)

## Tech Stack

- **Next.js** (App Router)
- **Tailwind CSS** v4
- **rss-parser** untuk parsing RSS feeds
- **Vercel** untuk hosting gratis

## Deploy ke Vercel (Gratis)

1. Push repo ini ke GitHub
2. Buka [vercel.com](https://vercel.com)
3. Import repo dari GitHub
4. Klik Deploy — selesai!

Domain gratis: `nama-project.vercel.app`

## Development

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Menambah Sumber Media

Edit file `src/lib/sources.js` — tambahkan objek baru ke array `MEDIA_SOURCES`:

```js
{
  name: "Nama Media",
  province: "Nama Provinsi",
  rss: "https://media.com/feed",
  website: "https://media.com",
}
```

## Cara Kerja

1. Server fetches semua RSS feed secara paralel
2. Filter artikel yang terbit dalam 3 jam terakhir
3. Sort berdasarkan waktu terbit (terbaru di atas)
4. Client auto-refresh setiap 30 detik
5. ISR (Incremental Static Regeneration) revalidate tiap 30 detik

## Batasan

- Kecepatan real-time tergantung seberapa cepat media mempublish RSS mereka (biasanya 1-5 menit)
- Google Trends update ~15 menit
- Beberapa media mungkin tidak menyediakan RSS feed (akan di-skip otomatis)
