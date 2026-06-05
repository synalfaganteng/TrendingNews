"use client";

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TN</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              Trending News
            </h1>
            <p className="text-xs text-gray-400">
              Berita real-time • 114 portal terverifikasi Dewan Pers • Sumut, Aceh, Sumbar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-800">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
