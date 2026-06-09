"use client";

import { useEffect, useState } from "react";

export default function TomorrowFollowUp() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const res = await fetch("/api/follow-up");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (data.predictions) {
          setPredictions(data.predictions);
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
      <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 p-4 mb-4">
        <h3 className="flex items-center gap-2 text-base font-bold text-white mb-3">
          <span className="text-xl animate-pulse">🔮</span>
          Meramal Berita Besok...
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || predictions.length === 0) {
    return null; // Sembunyikan jika error atau tidak ada prediksi
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-4 mb-4 shadow-lg shadow-indigo-500/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
      
      <h3 className="flex items-center gap-2 text-base font-bold text-white mb-4 relative z-10">
        <span className="text-xl">🔮</span>
        Follow Up Besok
      </h3>
      
      <div className="space-y-3 relative z-10">
        {predictions.map((p, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 hover:bg-white/10 transition-colors">
            <h4 className="text-indigo-300 font-bold text-sm mb-1 line-clamp-2">
              {p.title}
            </h4>
            <p className="text-gray-300 text-xs leading-relaxed opacity-90 line-clamp-3">
              {p.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between">
        <span className="text-[10px] text-indigo-300/60 uppercase tracking-wider font-bold">
          AI Generated Prediction
        </span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
      </div>
    </div>
  );
}
