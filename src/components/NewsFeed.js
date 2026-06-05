"use client";

import { useState, useEffect, useCallback } from "react";

const PROVINCES = [
  "Semua",
  "Sumatera Utara",
  "Aceh",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
];

function timeAgo(timestamp) {
  if (!timestamp) return "Baru saja";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds} detik lalu`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  return `${hours} jam lalu`;
}

function getTypeBadge(type) {
  switch (type) {
    case "trending":
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-yellow-900/50 text-yellow-400 border border-yellow-800">
          🔥 Trending
        </span>
      );
    case "google-news":
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-blue-900/50 text-blue-400 border border-blue-800">
          📰 Google News
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 text-xs rounded bg-purple-900/50 text-purple-400 border border-purple-800">
          ✓ Media Terverifikasi
        </span>
      );
  }
}

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("Semua");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "150" });
      if (province !== "Semua") {
        params.set("province", province);
      }
      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      setNews(data.items || []);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error("Gagal fetch berita:", err);
    } finally {
      setLoading(false);
    }
  }, [province]);

  useEffect(() => {
    setLoading(true);
    fetchNews();

    // Auto-refresh setiap 30 detik
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <section>
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {PROVINCES.map((p) => (
          <button
            key={p}
            onClick={() => setProvince(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              province === p
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {p}
          </button>
        ))}
        {lastUpdated && (
          <span className="ml-auto text-xs text-gray-500">
            Diperbarui: {new Date(lastUpdated).toLocaleTimeString("id-ID")}
          </span>
        )}
      </div>

      {/* News List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-900 rounded-xl p-4 border border-gray-800"
            >
              <div className="h-4 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Tidak ada berita dalam 3 jam terakhir</p>
          <p className="text-sm mt-1">
            untuk filter &quot;{province}&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((item, idx) => (
            <article
              key={`${item.link}-${idx}`}
              className="bg-gray-900 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-red-400 transition-colors line-clamp-2"
                  >
                    {item.title}
                  </a>
                  {item.snippet && (
                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                      {item.snippet.slice(0, 150)}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {getTypeBadge(item.type)}
                    <span className="text-xs text-gray-500">
                      {item.source}
                    </span>
                    <span className="text-xs text-gray-600">•</span>
                    <span className="text-xs text-gray-500">
                      {item.province}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                  {timeAgo(item.pubDate)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
