import "./globals.css";

export const metadata = {
  title: "Trending Sumatera - Berita Real-Time",
  description:
    "Aggregator berita real-time dari media terverifikasi Dewan Pers untuk wilayah Sumatera",
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
