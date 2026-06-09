"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import TomorrowFollowUp from "./TomorrowFollowUp";

const PROVINCES = [
  { value: "", label: "Semua" },
  { value: "Sumatera Utara", label: "Sumut" },
  { value: "Aceh", label: "Aceh" },
  { value: "Sumatera Barat", label: "Sumbar" },
  { value: "Riau", label: "Riau" },
  { value: "Kepulauan Riau", label: "Kepri" },
];

const SORT_OPTIONS = [
  { value: "viral", label: "🔥 Paling Viral" },
  { value: "time", label: "🕐 Paling Baru" },
  { value: "followup", label: "🔮 Follow Up Besok" },
];

function timeAgo(timestamp) {
  if (!timestamp) return "baru saja";
  const s = Math.floor((Date.now() - timestamp) / 1000);
  if (s < 60) return `${s} detik lalu`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

function ScoreBadge({ score }) {
  if (score == null) return null;
  let bg, label;
  if (score >= 75) { bg = "bg-red-500 text-white"; label = "SANGAT VIRAL"; }
  else if (score >= 55) { bg = "bg-orange-500 text-white"; label = "BERPOTENSI"; }
  else if (score >= 35) { bg = "bg-yellow-500 text-black"; label = "CUKUP"; }
  else { bg = "bg-gray-700 text-gray-300"; label = "BIASA"; }
  return (
    <span className={`inline-flex items-center gap-1.5 ${bg} text-sm font-bold px-2.5 py-1 rounded-lg`}>
      <span className="tabular-nums">{score}</span>
      <span className="text-xs opacity-90">{label}</span>
    </span>
  );
}

function NewsCard({ item, isNew }) {
  const v = item.viral || {};
  const isHot = v.viralScore >= 75;
  const isPotential = v.viralScore >= 55;

  return (
    <article
      className={`relative rounded-2xl border p-4 sm:p-5 transition-colors animate-fade-up ${
        isHot
          ? "bg-red-950/20 border-red-500/40"
          : isPotential
            ? "bg-orange-950/15 border-orange-500/30"
            : "bg-white/[0.03] border-white/10 hover:border-white/25"
      }`}
    >
      {/* NEW badge */}
      {isNew && (
        <span className="absolute -top-2 -left-2 px-2.5 py-1 rounded-lg bg-green-500 text-white text-xs font-black shadow-lg animate-fade-up">
          BARU ✨
        </span>
      )}

      {/* Top row: score + category */}
      <div className="flex items-center gap-2 mb-2.5 flex-wrap">
        <ScoreBadge score={v.viralScore} />
        {v.contentType && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-sm text-gray-200 font-medium">
            <span>{v.contentType.icon}</span>
            {v.contentType.type}
          </span>
        )}
        {item.isOriginal === true && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-500/15 text-green-400 border border-green-500/40 text-sm font-bold">
            ⚡ Berita Pertama
          </span>
        )}
      </div>

      {/* Title — BIG */}
      <a href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-pink-300 transition-colors">
          {item.title}
        </h3>
      </a>

      {/* Snippet */}
      {item.snippet && (
        <p className="text-base text-gray-400 mt-2 line-clamp-2 leading-relaxed">
          {item.snippet.slice(0, 160)}
        </p>
      )}

      {/* Source row — clear labels */}
      <div className="flex items-center gap-2 mt-3 flex-wrap text-sm">
        <span className="inline-flex items-center gap-1.5 text-gray-300">
          <span className="text-gray-500">Sumber:</span>
          <span className="font-semibold">{item.source}</span>
        </span>
        {item.regions && item.regions.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium">
            📍 {item.regions.slice(0, 2).join(", ")}
          </span>
        )}
        <span className="text-gray-500">·</span>
        <span className="text-gray-400">{timeAgo(item.pubDate)}</span>
      </div>

      {/* Original source */}
      {item.originalSource && (
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-200">
            <span className="font-bold">⏪ Berita ini sudah pernah tayang lebih dulu di:</span>
          </p>
          <a
            href={item.originalSource.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1 text-base text-amber-300 font-bold underline hover:text-amber-200"
          >
            {item.originalSource.source}
          </a>
          <span className="text-sm text-amber-400/80 ml-2">
            ({item.originalSource.timeDiff})
          </span>
          {item.originalSource.verifiedByAI && (
            <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold">
              🤖 Diverifikasi AI
            </span>
          )}
        </div>
      )}

      {/* AI Reason Insight */}
      {item.aiReason && (
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 shadow-inner">
          <p className="text-sm text-indigo-200 leading-relaxed flex items-start gap-2">
            <span className="text-lg">🤖</span>
            <span>
              <strong className="text-indigo-300 font-bold">Kenapa Penting?</strong> {item.aiReason}
            </span>
          </p>
        </div>
      )}
    </article>
  );
}


export default function NewsFeed() {
  const [news, setNews] = useState([]);
  const [pending, setPending] = useState([]); // berita baru yang belum ditampilkan
  const [newLinks, setNewLinks] = useState(new Set()); // link berita baru (untuk badge)
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState("");
  const [sort, setSort] = useState("viral");
  const [count, setCount] = useState(0);
  const [updated, setUpdated] = useState(null);
  const [feedSummary, setFeedSummary] = useState(null);

  // Simpan link yang sedang tampil untuk deteksi berita baru
  const shownLinksRef = useRef(new Set());

  const doFetch = useCallback(async (skipOrigin = false) => {
    const params = new URLSearchParams({ limit: "100", sort });
    if (province) params.set("province", province);
    if (skipOrigin) params.set("skipOrigin", "true");
    const res = await fetch(`/api/news?${params}`);
    return res.json();
  }, [province, sort]);

  // Fetch awal / saat filter berubah → langsung tampilkan (dengan origin search)
  const initialLoad = useCallback(async () => {
    try {
      setLoading(true);
      const data = await doFetch(false);
      const items = data.items || [];
      setNews(items);
      setCount(data.count || 0);
      setUpdated(data.lastUpdated);
      setFeedSummary(data.feedSummary || null);
      setPending([]);
      setNewLinks(new Set());
      shownLinksRef.current = new Set(items.map((i) => i.link));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [doFetch]);

  // Polling RINGAN → skipOrigin=true (tidak panggil Serper/AI, hemat kuota).
  // Hanya cek apakah ada berita baru. Origin dicari saat user klik "reveal".
  const pollUpdate = useCallback(async () => {
    try {
      const data = await doFetch(true);
      const items = data.items || [];
      setUpdated(data.lastUpdated);
      const fresh = items.filter((i) => !shownLinksRef.current.has(i.link));
      if (fresh.length > 0) {
        setPending(items);
      }
    } catch (err) {
      console.error(err);
    }
  }, [doFetch]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  useEffect(() => {
    const i = setInterval(pollUpdate, 30000); // cek tiap 30 detik (ringan)
    return () => clearInterval(i);
  }, [pollUpdate]);

  // Tampilkan berita baru → fetch ulang dengan origin search untuk yang baru
  const revealNew = async () => {
    if (pending.length === 0) return;
    const freshLinks = new Set(
      pending
        .filter((i) => !shownLinksRef.current.has(i.link))
        .map((i) => i.link)
    );
    // Tampilkan dulu (cepat), lalu fetch versi lengkap dengan origin di belakang
    setNews(pending);
    setCount(pending.length);
    setNewLinks(freshLinks);
    shownLinksRef.current = new Set(pending.map((i) => i.link));
    setPending([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setNewLinks(new Set()), 8000);

    // Fetch versi dengan origin source (skor tinggi saja, di server)
    try {
      const data = await doFetch(false);
      if (data.items) {
        setNews(data.items);
        setFeedSummary(data.feedSummary || feedSummary);
        shownLinksRef.current = new Set(data.items.map((i) => i.link));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Hitung berapa berita baru di pending
  const newCount = pending.filter(
    (i) => !shownLinksRef.current.has(i.link)
  ).length;

  return (
    <section>
      {/* Filter panel */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 mb-4">
        <p className="text-sm font-semibold text-gray-400 mb-2">Pilih Wilayah</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {PROVINCES.map((p) => (
            <button
              key={p.value}
              onClick={() => setProvince(p.value)}
              className={`px-4 py-2 rounded-xl text-base font-bold transition-colors ${
                province === p.value
                  ? "bg-rose-500 text-white"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="text-sm font-semibold text-gray-400 mb-2">Urutkan</p>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSort(s.value)}
              className={`px-4 py-2 rounded-xl text-base font-medium transition-colors ${
                sort === s.value
                  ? "bg-white/15 text-white border border-white/25"
                  : "bg-white/[0.03] text-gray-400 border border-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400 mt-3 pt-3 border-t border-white/5">
          <span>
            Menampilkan <strong className="text-white">{count}</strong> berita
          </span>
          {updated && (
            <span>
              Update: {new Date(updated).toLocaleTimeString("id-ID")}
            </span>
          )}
        </div>
      </div>

      {/* Sticky "berita baru" indicator */}
      {newCount > 0 && (
        <div className="sticky top-[76px] z-30 flex justify-center mb-3">
          <button
            onClick={revealNew}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-base font-bold shadow-xl shadow-pink-500/30 flex items-center gap-2 hover:scale-105 transition-transform animate-fade-up"
          >
            <span className="animate-bounce">↑</span>
            {newCount} Berita Baru Masuk — Klik untuk Lihat
          </button>
        </div>
      )}

      {/* List */}
      {sort === "followup" ? (
        <TomorrowFollowUp />
      ) : loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white/[0.02] border border-white/10">
          <p className="text-5xl mb-3">🔍</p>
          <p className="text-lg text-gray-300 font-medium">
            Belum ada berita yang cocok
          </p>
          <p className="text-base text-gray-500 mt-1">
            Coba ganti wilayah atau tunggu update berikutnya
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* AI Feed Summary */}
          {feedSummary && (
            <div className="mb-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-indigo-500/40 shadow-lg relative overflow-hidden animate-fade-up">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2 relative z-10">
                <span className="text-xl animate-pulse">🤖</span>
                Ringkasan AI Terkini
              </h3>
              <p className="text-indigo-100/90 text-sm md:text-base leading-relaxed relative z-10">
                {feedSummary}
              </p>
            </div>
          )}

          {news.map((item, idx) => (
            <NewsCard
              key={`${item.link}-${idx}`}
              item={item}
              isNew={newLinks.has(item.link)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

