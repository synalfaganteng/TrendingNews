"use client";

import { useState, useEffect } from "react";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-pink-500/30">
            ⚡
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black leading-none">
              <span className="gradient-text">Trending</span>
              <span className="text-white">News</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Pemantau Berita Viral Sumatera
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm font-mono text-gray-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            {time}
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-red-500/15 text-red-400 border border-red-500/30">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </header>
  );
}
