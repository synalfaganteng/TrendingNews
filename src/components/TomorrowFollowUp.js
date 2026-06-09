"use client";

import { useEffect, useState } from "react";

function ScoreBadge({ score, label }) {
  if (score == null) return null;
  let bg, ring;
  if (score >= 85) { bg = "bg-red-500 text-white shadow-red-500/30"; ring = "ring-red-500/50"; }
  else if (score >= 70) { bg = "bg-orange-500 text-white shadow-orange-500/30"; ring = "ring-orange-500/50"; }
  else if (score >= 50) { bg = "bg-yellow-500 text-black shadow-yellow-500/30"; ring = "ring-yellow-500/50"; }
  else { bg = "bg-gray-600 text-white shadow-gray-500/20"; ring = "ring-gray-500/50"; }

  return (
    <span className={`inline-flex items-center gap-1.5 ${bg} ring-1 ${ring} text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg`}>
      <span className="tabular-nums">⭐ {score}</span>
      <span className="opacity-95 tracking-wide uppercase text-[10px]">{label || "Kelayakan"}</span>
    </span>
  );
}

export default function TomorrowFollowUp() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [timePassed, setTimePassed] = useState(0);

  useEffect(() => {
    // Timer for loading state to show AI is working hard
    let interval;
    if (loading) {
      interval = setInterval(() => setTimePassed((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch("/api/follow-up");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.predictions) {
          // Sort predictions by score descending just in case AI didn't
          const sorted = data.predictions.sort((a, b) => (b.score || 0) - (a.score || 0));
          setPredictions(sorted);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="w-full mt-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-purple-900/60 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
        {/* Animated background rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-indigo-500/20 rounded-full animate-ping [animation-duration:3s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/30 rounded-full animate-ping [animation-duration:2s]" />
        
        <span className="text-6xl mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">🔮</span>
        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2 text-center">
          Menganalisa Berita Hari Ini...
        </h3>
        <p className="text-indigo-200/70 text-center max-w-sm mb-6">
          AI sedang memproses jutaan data tren untuk meramal hingga 20 sudut pandang berita esok hari.
        </p>
        
        {/* Progress simulator */}
        <div className="w-64 h-2 bg-black/50 rounded-full overflow-hidden border border-indigo-500/20">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-[progress_15s_ease-out_forwards] w-[5%]" style={{ width: `${Math.min(95, timePassed * 5)}%` }} />
        </div>
        <p className="text-xs text-indigo-400 mt-3 tabular-nums font-mono">
          {timePassed} detik berlalu (estimasi 15-30 detik)
        </p>
      </div>
    );
  }

  if (error || predictions.length === 0) {
    return (
      <div className="w-full mt-6 rounded-2xl bg-white/[0.02] border border-red-500/20 p-8 text-center">
        <p className="text-4xl mb-4">⚠️</p>
        <p className="text-lg text-gray-300 font-medium">Gagal memuat ramalan AI.</p>
        <p className="text-sm text-gray-500">Coba muat ulang halaman beberapa saat lagi.</p>
      </div>
    );
  }

  return (
    <div className="w-full mt-6 animate-fade-up">
      {/* Header section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-950 border border-indigo-400/30 p-6 md:p-8 mb-6 shadow-2xl shadow-indigo-900/40 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/30 rounded-full blur-[80px]" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 drop-shadow-md">
              <span className="text-4xl drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">🔮</span>
              Prediksi Berita Besok
            </h2>
            <p className="text-indigo-200 mt-2 text-base md:text-lg max-w-xl">
              <strong className="text-white">AI DeepSeek</strong> telah merangkum {predictions.length} skenario berita lanjutan yang paling berpotensi naik esok hari berdasarkan tren hari ini.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-500/40 text-green-300 font-bold shadow-lg shadow-green-500/10">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              Sistem Cache Aktif
            </span>
            <span className="text-xs text-indigo-300/70">Anti-lambat saat di-refresh</span>
          </div>
        </div>
      </div>

      {/* List Layout */}
      <div className="flex flex-col gap-4">
        {predictions.map((p, idx) => {
          const isTop3 = idx < 3;
          
          return (
            <div 
              key={idx} 
              className={`relative rounded-xl border p-5 transition-all duration-300 hover:bg-white/[0.08] hover:shadow-xl group flex flex-col md:flex-row gap-5 items-start
                ${isTop3 
                  ? "bg-gradient-to-r from-indigo-900/40 to-fuchsia-900/10 border-indigo-400/40 shadow-indigo-500/10" 
                  : "bg-white/[0.02] border-white/10"
                }`}
            >
              {/* Nomor Urut Bulat di Kiri */}
              <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full font-black text-xl shadow-lg border-2 
                ${isTop3 ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-white border-yellow-200 shadow-amber-500/30" : "bg-slate-800 text-gray-300 border-slate-600"}
              `}>
                {idx + 1}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <ScoreBadge score={p.score} label={p.scoreLabel} />
                </div>
                
                <h4 className={`font-black text-xl mb-3 leading-snug transition-colors
                  ${isTop3 ? "text-indigo-100 group-hover:text-white" : "text-gray-100 group-hover:text-indigo-200"}`}>
                  {p.title}
                </h4>
                
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
