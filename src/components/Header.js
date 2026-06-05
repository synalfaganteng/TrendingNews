"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-pink-500/30">
              <span className="text-white font-black text-lg">⚡</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-black rounded-full animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-black tracking-tight">
              <span className="gradient-text">Trending</span>
              <span className="text-white">News</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-400 truncate">
              Pemilih Berita Viral · 200+ portal Dewan Pers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            {time}
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/30">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
