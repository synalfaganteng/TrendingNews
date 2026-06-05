"use client";

import { useState, useEffect, useCallback } from "react";

const PROVINCES = [
  { value: "", label: "Semua Provinsi" },
  { value: "Sumatera Utara", label: "Sumatera Utara" },
  { value: "Aceh", label: "Aceh" },
  { value: "Sumatera Barat", label: "Sumatera Barat" },
  { value: "Riau", label: "Riau" },
  { value: "Kepulauan Riau", label: "Kepulauan Riau" },
];

const SORT_OPTIONS = [
  { value: "viral", label: "🔥 Potensi Viral" },
  { value: "time", label: "🕐 Terbaru" },
];

const PLATFORM_ICONS = {
  tiktok: "🎵",
  twitter: "𝕏",
  instagram: "📷",
  facebook: "👥",
};

const PLATFORM_COLORS = {
  tiktok: "bg-pink-900/50 text-pink-400 border-pink-800",
  twitter: "bg-sky-900/50 text-sky-400 border-sky-800",
  instagram: "bg-fuchsia-900/50 text-fuchsia-400 border-fuchsia-800",
  facebook: "bg-blue-900/50 text-blue-400 border-blue-800",
};

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
          ✓ Terverifikasi
        </span>
      );
  }
}

function ViralBadge({ viral }) {
  if (!viral) return null;

  let bgColor;
  if (viral.viralScore >= 70) bgColor = "bg-red-600";
  else if (viral.viralScore >= 50) bgColor = "bg-orange-600";
  else if (viral.viralScore >= 30) bgColor = "bg-yellow-600";
  else bgColor = "bg-gray-600";

  return (
    <span
      className={`${bgColor} text-white text-xs font-bold px-2 py-0.5 rounded-full`}
    >
      {viral.viralScore}
    </span>
  );
}

function PlatformBadges({ platforms }) {
  if (!platforms || platforms.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {platforms.map(({ platform }) => (
        <span
          key={platform}
          className={`px-1.5 py-0.5 text-xs rounded border ${PLATFORM_COLORS[platform]}`}
          title={`Berpotensi viral di ${platform}`}
        >
          {PLATFORM_ICONS[platform]} {platform}
        </span>
      ))}
    </div>
  );
}

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("");
  const [sort, setSort] = useState("viral");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "150", sort });
      if (province) {
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
  }, [province, sort]);

  useEffect(() => {
    setLoading(true);
    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <section>
      {/* Filter & Sort */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {PROVINCES.map((p) => (
            <button
              key={p.value}
              onClick={() => setProvince(p.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                province === p.value
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSort(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sort === opt.value
                    ? "bg-gray-700 text-white border border-gray-600"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Update: {new Date(lastUpdated).toLocaleTimeString("id-ID")}
            </span>
          )}
        </div>
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
          {province && (
            <p className="text-sm mt-1">
              untuk provinsi &quot;{province}&quot;
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {news.map((item, idx) => (
            <article
              key={`${item.link}-${idx}`}
              className={`bg-gray-900 rounded-xl p-4 border transition-colors ${
                item.viral && item.viral.viralScore >= 70
                  ? "border-red-800/60"
                  : item.viral && item.viral.viralScore >= 50
                    ? "border-orange-800/40"
                    : "border-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.viral && <ViralBadge viral={item.viral} />}
                    {item.viral && item.viral.viralScore >= 50 && (
                      <span className="text-xs text-orange-400">
                        {item.viral.viralLevel}
                      </span>
                    )}
                    {item.isOriginal && (
                      <span className="px-1.5 py-0.5 text-xs rounded bg-green-900/50 text-green-400 border border-green-800">
                        ⚡ Pertama
                      </span>
                    )}
                  </div>
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
                    {item.provinces && item.provinces.length > 0 && (
                      <>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-cyan-500">
                          {item.provinces.join(", ")}
                        </span>
                      </>
                    )}
                    {item.regions && item.regions.length > 0 && (
                      <>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-emerald-500">
                          📍 {item.regions.slice(0, 3).join(", ")}
                        </span>
                      </>
                    )}
                  </div>
                  {/* Original Source indicator */}
                  {item.originalSource && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-950/30 border border-amber-900/50">
                      <p className="text-xs text-amber-400">
                        ⏪ Pertama ditulis oleh{" "}
                        <a
                          href={item.originalSource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline hover:text-amber-300"
                        >
                          {item.originalSource.source}
                        </a>
                        {" "}({item.originalSource.timeDiff})
                      </p>
                    </div>
                  )}
                  {item.viral &&
                    item.viral.platforms &&
                    item.viral.platforms.length > 0 && (
                      <div className="mt-2">
                        <PlatformBadges platforms={item.viral.platforms} />
                      </div>
                    )}
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
