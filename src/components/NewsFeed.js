"use client";

import { useState, useEffect, useCallback } from "react";

const PROVINCES = [
  { value: "", label: "Semua" },
  { value: "Sumatera Utara", label: "Sumut" },
  { value: "Aceh", label: "Aceh" },
  { value: "Sumatera Barat", label: "Sumbar" },
  { value: "Riau", label: "Riau" },
  { value: "Kepulauan Riau", label: "Kepri" },
];

const SORT_OPTIONS = [
  { value: "viral", label: "Viral" },
  { value: "time", label: "Terbaru" },
];

function timeAgo(timestamp) {
  if (!timestamp) return "baru";
  const s = Math.floor((Date.now() - timestamp) / 1000);
  if (s < 60) return `${s}d lalu`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
}

function ScoreBadge({ score }) {
  if (score == null) return null;
  let bg, text;
  if (score >= 75) { bg = "bg-red-500"; text = "text-white"; }
  else if (score >= 55) { bg = "bg-orange-500"; text = "text-white"; }
  else if (score >= 35) { bg = "bg-yellow-500"; text = "text-black"; }
  else { bg = "bg-gray-700"; text = "text-gray-300"; }
  return (
    <span className={`${bg} ${text} text-[10px] font-black px-1.5 py-0.5 rounded tabular-nums`}>
      {score}
    </span>
  );
}

function NewsCard({ item }) {
  const v = item.viral || {};
  const isHot = v.viralScore >= 75;
  const isPotential = v.viralScore >= 55;

  return (
    <article
      className={`rounded-xl border p-3 transition-colors ${
        isHot
          ? "bg-red-950/20 border-red-500/30"
          : isPotential
            ? "bg-orange-950/15 border-orange-500/25"
            : "bg-white/[0.02] border-white/10 hover:border-white/20"
      }`}
    >
      {/* Top meta row */}
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap text-[10px]">
        <ScoreBadge score={v.viralScore} />
        {v.contentType && (
          <span className="text-gray-400">
            {v.contentType.icon} {v.contentType.type}
          </span>
        )}
        {v.viralLevel && (
          <span className="text-orange-300 font-bold">{v.viralLevel}</span>
        )}
        {item.isOriginal && (
          <span className="px-1.5 py-0.5 rounded bg-green-500/15 text-green-400 border border-green-500/30 font-bold">
            ⚡ Pertama
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
        <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug line-clamp-3 hover:text-pink-300 transition-colors">
          {item.title}
        </h3>
      </a>

      {/* Source row */}
      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-500 flex-wrap">
        <span className="font-medium text-gray-400 truncate max-w-[160px]">
          {item.source}
        </span>
        {item.regions && item.regions.length > 0 && (
          <>
            <span className="text-gray-700">·</span>
            <span className="text-emerald-400">
              📍 {item.regions.slice(0, 2).join(", ")}
            </span>
          </>
        )}
        <span className="text-gray-700">·</span>
        <span>{timeAgo(item.pubDate)}</span>
      </div>

      {/* Original source warning */}
      {item.originalSource && (
        <div className="mt-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px]">
          <span className="text-amber-400">⏪ Pertama:</span>{" "}
          <a
            href={item.originalSource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 font-semibold underline"
          >
            {item.originalSource.source}
          </a>{" "}
          <span className="text-amber-500/70">
            ({item.originalSource.timeDiff})
          </span>
        </div>
      )}
    </article>
  );
}

export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("");
  const [sort, setSort] = useState("viral");
  const [count, setCount] = useState(0);
  const [updated, setUpdated] = useState(null);

  const fetchNews = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "100", sort });
      if (province) params.set("province", province);
      const res = await fetch(`/api/news?${params}`);
      const data = await res.json();
      setNews(data.items || []);
      setCount(data.count || 0);
      setUpdated(data.lastUpdated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [province, sort]);

  useEffect(() => {
    setLoading(true);
    fetchNews();
    const i = setInterval(fetchNews, 60000); // refresh tiap 60 detik
    return () => clearInterval(i);
  }, [fetchNews]);

  return (
    <section>
      {/* Filter — sticky */}
      <div className="sticky top-[52px] z-40 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 bg-black/90 backdrop-blur border-b border-white/5 mb-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {PROVINCES.map((p) => (
            <button
              key={p.value}
              onClick={() => setProvince(p.value)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                province === p.value
                  ? "bg-rose-500 text-white"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
          <span className="shrink-0 self-center text-gray-700 text-xs px-1">|</span>
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                sort === s.value
                  ? "bg-white/10 text-white border border-white/20"
                  : "bg-white/[0.03] text-gray-500 border border-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
          <span>
            <strong className="text-white">{count}</strong> berita
            {province && ` · ${province}`}
          </span>
          {updated && (
            <span className="font-mono">
              {new Date(updated).toLocaleTimeString("id-ID")}
            </span>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-white/5 animate-pulse"
            />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-3xl mb-2">🤷</p>
          <p className="text-gray-400 text-sm">Tidak ada berita relevan</p>
          <p className="text-xs text-gray-600 mt-1">3 jam terakhir</p>
        </div>
      ) : (
        <div className="space-y-2">
          {news.map((item, idx) => (
            <NewsCard key={`${item.link}-${idx}`} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
