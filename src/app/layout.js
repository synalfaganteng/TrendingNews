import "./globals.css";

export const metadata = {
  title: "Trending Sumut - Berita Real-Time Sumatera Utara",
  description:
    "Aggregator berita real-time dari 56 portal media terverifikasi Dewan Pers untuk Sumatera Utara. Filter per kota/kabupaten, viral scoring, prediksi platform sosmed.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
