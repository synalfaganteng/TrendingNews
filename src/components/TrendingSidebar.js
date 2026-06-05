"use client";

import { useState, useEffect } from "react";

const PLATFORM_ICONS = {
  tiktok: "🎵 TikTok",
  twitter: "𝕏 Twitter",
  instagram: "📷 Instagram",
  facebook: "👥 Facebook",
};

export default function TrendingSidebar() {
  const [trends, setTrends] = useState([]);
  const [topViral, setTopViral] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendsRes, newsRes] = await Promise.all([
          fetch("/api/trending"),
          fetch("/api/news?sort=viral&limit=5"),
        ]);
        const trendsData = await trendsRes.json();
        const newsData = await newsRes.json();
        setTrends(trendsData.items || []);
        setTopViral(newsData.items || []);
      } catch (err) {
        console.error("Gagal fetch:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Top Viral Section */}
      <div className="bg-gray-900 rounded-xl border border-red-900/50 p-4">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🚀</span> Paling Viral
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-800 rounded w-full mb-1" />
              </div>
            ))}
          </div>
        ) : topViral.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada data</p>
        ) : (
          <ul className="space-y-3">
            {topViral.map((item, idx) => (
              <li
                key={idx}
                className="border-b border-gray-800 pb-2 last:border-0"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-200 hover:text-red-400 transition-colors line-clamp-2 font-medium"
                >
                  {item.title}
                </a>
                <div className="flex items-center gap-2 mt-1">
                  {item.viral && (
                    <span className="text-xs font-bold text-red-400">
                      Score: {item.viral.viralScore}
                    </span>
                  )}
                  {item.viral &&
                    item.viral.platforms &&
                    item.viral.platforms[0] && (
                      <span className="text-xs text-gray-500">
                        → {PLATFORM_ICONS[item.viral.platforms[0].platform]}
                      </span>
                    )}
                </div>
                {item.regions && item.regions.length > 0 && (
                  <span className="text-xs text-emerald-600">
                    📍 {item.regions.join(", ")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Google Trends */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span>🔥</span> Google Trends
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-gray-800 rounded w-full mb-1" />
              </div>
            ))}
          </div>
        ) : trends.length === 0 ? (
          <p className="text-gray-500 text-sm">Tidak ada data trending</p>
        ) : (
          <ul className="space-y-2">
            {trends.slice(0, 15).map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <span className="text-xs text-gray-600 font-mono mt-0.5 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-red-400 transition-colors line-clamp-2">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">
          Prediksi Platform
        </h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>🎵</span>
            <span>TikTok — Drama, emosional, heboh</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>𝕏</span>
            <span>Twitter — Politik, breaking, data</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>📷</span>
            <span>Instagram — Visual, wisata, lifestyle</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>👥</span>
            <span>Facebook — Lokal, komunitas, keluarga</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            <strong className="text-gray-400">99 portal</strong> media siber
            terverifikasi Dewan Pers (5 provinsi)
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Filter: hanya berita relevan Sumut (8 Kota • 25 Kabupaten)
          </p>
        </div>
      </div>
    </div>
  );
}
