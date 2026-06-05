"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-sm font-black">
            ⚡
          </div>
          <h1 className="text-base sm:text-lg font-black">
            <span className="gradient-text">Trending</span>News
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
          LIVE
        </span>
      </div>
    </header>
  );
}
