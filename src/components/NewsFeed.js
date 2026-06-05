"use client";

import { useState, useEffect, useCallback } from "react";

const PROVINCES = [
  { value: "", label: "Semua", emoji: "🌐" },
  { value: "Sumatera Utara", label: "Sumut", emoji: "🏔️" },
  { value: "Aceh", label: "Aceh", emoji: "🕌" },
  { value: "Sumatera Barat", label: "Sumbar", emoji: "🏞️" },
  { value: "Riau", label: "Riau", emoji: "🌴" },
  { value: "Kepulauan Riau", label: "Kepri", emoji: "🏝️" },
];

const SORT_OPTIONS = [
  { value: "viral", label: "🔥 Viral" },
  { value: "reach", label: "👁️ Viewers" },
  { value: "time", label: "🕐 Terbaru" },
];

const PLATFORM_FILTERS = [
  { value: "", label: "Semua" },
  { value: "tiktok", label: "🎵 TikTok" },
  { value: "instagram", label: "📷 IG" },
  { value: "twitter", label: "𝕏 Twitter" },
  { value: "facebook", label: "👥 FB" },
];

const PLATFORM_COLORS = {
  tiktok: "from-pink-500/20 to-rose-500/20 border-pink-500/40 text-pink-300",
  twitter: "from-sky-500/20 to-blue-500/20 border-sky-500/40 text-sky-300",
  instagram: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/40 text-fuchsia-300",
  facebook: "from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300",
};

function timeAgo(timestamp) {
  if (!timestamp) return "Baru saja";
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds} detik`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} menit`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam`;
  return `${Math.floor(h / 24)} hari`;
}

function ScoreRing({ score }) {
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 75 ? "#ef4444" : score >= 55 ? "#f97316" : score >= 35 ? "#eab308" : "#6b7280";

  return (
    <div className="relative w-12 h-12 shrink-0">
      <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r="18" stroke="#1f2937" strokeWidth="3" fill="none" />
        <circle
          cx="22"
          cy="22"
          r="18"
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black tabular-nums" style={{ color }}>
          {score}
        </span>
      </div>
    </div>
  );
}

function PlatformBadges({ platforms, compact = false }) {
  if (!platforms || platforms.length === 0) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {platforms.slice(0, compact ? 2 : 4).map(({ platform, label, icon }) => (
        <span
          key={platform}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded-md bg-gradient-to-br ${PLATFORM_COLORS[platform]} border font-medium`}
        >
          <span>{icon}</span>
          {!compact && <span>{label}</span>}
        </span>
      ))}
    </div>
  );
}

function getTypeBadge(item) {
  if (item.type === "trending")
    return { label: "Google Trends", color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30" };
  if (item.type === "google-news")
    return { label: "Google News", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" };
  return { label: "Portal", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" };
}

function NewsCard({ item }) {
  const v = item.viral || {};
  const isHot = v.viralScore >= 75;
  const isPotential = v.viralScore >= 55;

  const typeBadge = getTypeBadge(item);

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br transition-all hover:scale-[1.005] animate-fade-up ${
        isHot
          ? "from-red-950/30 to-pink-950/20 border-red-500/30 glow-red"
          : isPotential
            ? "from-orange-950/20 to-yellow-950/10 border-orange-500/25"
            : "from-white/[0.02] to-transparent border-white/10 hover:border-white/20"
      }`}
    >
      {/* Top accent line for hot items */}
      {isHot && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500" />
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Score Ring */}
          <ScoreRing score={v.viralScore || 0} />

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Top row: badges */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              {v.contentType && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-300 font-medium">
                  <span>{v.contentType.icon}</span>
                  {v.contentType.type}
                </span>
              )}
              {isPotential && v.viralLevel && (
                <span className="text-[10px] font-bold text-orange-300">
                  {v.viralLevel}
                </span>
              )}
              {item.isOriginal && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-green-500/15 border border-green-500/30 text-[10px] text-green-300 font-bold">
                  ⚡ Pertama Tayang
                </span>
              )}
            </div>

            {/* Title */}
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-3 hover:text-pink-300 transition-colors">
                {item.title}
              </h3>
            </a>

            {/* Snippet */}
            {item.snippet && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {item.snippet.slice(0, 140)}
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
              <span className={`px-1.5 py-0.5 rounded border ${typeBadge.color}`}>
                {typeBadge.label}
              </span>
              <span className="text-gray-500 font-medium truncate max-w-[140px]">
                {item.source}
              </span>
              {item.regions && item.regions.length > 0 && (
                <>
                  <span className="text-gray-700">·</span>
                  <span className="text-emerald-400 font-medium">
                    📍 {item.regions.slice(0, 2).join(", ")}
                  </span>
                </>
              )}
              <span className="text-gray-700">·</span>
              <span className="text-gray-500">{timeAgo(item.pubDate)} lalu</span>
            </div>

            {/* Reach + Platforms */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {v.reach && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 font-medium">
                  👁️ {v.reach.range} viewers
                </span>
              )}
              {v.platforms && v.platforms.length > 0 && (
                <PlatformBadges platforms={v.platforms} compact />
              )}
            </div>

            {/* Original source warning */}
            {item.originalSource && (
              <div className="mt-2.5 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <p className="text-[11px] text-amber-300">
                  ⏪ <span className="font-semibold">Pertama ditulis</span>{" "}
                  <a
                    href={item.originalSource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:text-amber-200"
                  >
                    {item.originalSource.source}
                  </a>{" "}
                  <span className="text-amber-400/80">
                    ({item.originalSource.timeDiff})
                  </span>
                  {item.originalSource.viaGoogleSearch && (
                    <span className="ml-1 text-[9px] text-amber-500/60">
                      via Google
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("");
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState("viral");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [count, setCount] = useState(0);

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "100", sort });
      if (province) params.set("province", province);
      if (platform) params.set("platform", platform);

      const res = await fetch(`/api/news?${params.toString()}`);
      const data = await res.json();
      setNews(data.items || []);
      setLastUpdated(data.lastUpdated);
      setCount(data.count || 0);
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [province, platform, sort]);

  useEffect(() => {
    setLoading(true);
    fetchNews();
    const interval = setInterval(fetchNews, 30000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  return (
    <section>
      {/* Filter bar — sticky on mobile */}
      <div className="sticky top-[56px] sm:top-[60px] z-40 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2.5 bg-black/85 backdrop-blur-xl border-b border-white/5 mb-4">
        {/* Provinsi (horizontal scroll) */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2">
          {PROVINCES.map((p) => (
            <button
              key={p.value}
              onClick={() => setProvince(p.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                province === p.value
                  ? "gradient-bg text-white shadow-lg shadow-pink-500/30"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              <span className="mr-1">{p.emoji}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Sort + Platform */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mt-1.5">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sort === s.value
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
          <span className="shrink-0 self-center text-gray-700 text-xs px-1">|</span>
          {PLATFORM_FILTERS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPlatform(p.value)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                platform === p.value
                  ? "bg-pink-500/20 text-pink-300 border border-pink-500/40"
                  : "bg-white/[0.03] text-gray-400 border border-white/5 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Status row */}
        <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5">
          <span>
            <span className="text-white font-semibold">{count}</span> berita
            {province && <> · {province}</>}
            {platform && <> · {platform}</>}
          </span>
          {lastUpdated && (
            <span className="font-mono">
              Update {new Date(lastUpdated).toLocaleTimeString("id-ID")}
            </span>
          )}
        </div>
      </div>

      {/* News List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse h-32 rounded-2xl bg-white/5 border border-white/10"
            />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🤷</p>
          <p className="text-gray-400">Tidak ada berita yang cocok</p>
          <p className="text-xs text-gray-600 mt-1">
            dalam 3 jam terakhir
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {news.map((item, idx) => (
            <NewsCard key={`${item.link}-${idx}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
