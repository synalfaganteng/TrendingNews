"use client";

import { useState, useEffect } from "react";

function StatCard({ label, value, sublabel, accent = "white", icon }) {
  const accents = {
    red: "from-red-500/20 to-pink-500/20 border-red-500/30 text-red-300",
    orange: "from-orange-500/20 to-yellow-500/20 border-orange-500/30 text-orange-300",
    cyan: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300",
    purple: "from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-300",
    green: "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300",
    white: "from-white/5 to-white/0 border-white/10 text-white",
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${accents[accent]} border p-3 sm:p-4`}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wider opacity-70 truncate">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-black mt-0.5 tabular-nums">{value}</p>
          {sublabel && (
            <p className="text-[10px] sm:text-xs opacity-60 mt-0.5 truncate">
              {sublabel}
            </p>
          )}
        </div>
        {icon && <span className="text-2xl shrink-0 opacity-60">{icon}</span>}
      </div>
    </div>
  );
}

export default function StatsBar({ analytics }) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-20 rounded-2xl bg-white/5 border border-white/10"
          />
        ))}
      </div>
    );
  }

  const { total, avgViralScore, highPotentialCount, viralDist } = analytics;
  const sangatViralPct =
    total > 0 ? Math.round((viralDist.sangat / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
      <StatCard
        label="Total Berita"
        value={total}
        sublabel="3 jam terakhir"
        accent="cyan"
        icon="📰"
      />
      <StatCard
        label="Skor Viral Avg"
        value={avgViralScore}
        sublabel="dari 100"
        accent="purple"
        icon="📊"
      />
      <StatCard
        label="Potensi Viral"
        value={highPotentialCount}
        sublabel="score ≥ 55"
        accent="orange"
        icon="🔥"
      />
      <StatCard
        label="Sangat Viral"
        value={viralDist.sangat}
        sublabel={`${sangatViralPct}% dari total`}
        accent="red"
        icon="🚀"
      />
    </div>
  );
}
