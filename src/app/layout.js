import "./globals.css";

export const metadata = {
  title: "Trending News — Pemilih Berita Viral untuk Sosmed",
  description:
    "Aggregator berita real-time dari 200+ portal terverifikasi Dewan Pers di Sumatera. Deteksi spike, viral scoring, prediksi platform sosmed (TikTok, IG, X, FB).",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-black text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
