"use client";

import { useState, useEffect } from "react";

export default function TrendingSidebar() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrends() {
      try {
        const res = await fetch("/api/trending");
        const data = await res.json();
        setTrends(data.items || []);
      } catch (err) {
        console.error("Gagal fetch trending:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrends();
    const interval = setInterval(fetchTrends, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        <span>🔥</span> Google Trends Indonesia
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
          {trends.slice(0, 20).map((item, idx) => (
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

      <div className="mt-4 pt-3 border-t border-gray-800">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">
          Sumber Media
        </h3>
        <div className="flex flex-wrap gap-1">
          {[
            "Sumatera Utara",
            "Aceh",
            "Sumatera Barat",
            "Riau",
            "Kepulauan Riau",
          ].map((p) => (
            <span
              key={p}
              className="text-xs px-2 py-0.5 bg-gray-800 text-gray-400 rounded"
            >
              {p}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          23+ media terverifikasi Dewan Pers
        </p>
      </div>
    </div>
  );
}
