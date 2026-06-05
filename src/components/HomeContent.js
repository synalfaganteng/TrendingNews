"use client";

import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import NewsFeed from "./NewsFeed";
import InsightsSidebar from "./InsightsSidebar";

export default function HomeContent() {
  const [analytics, setAnalytics] = useState(null);
  const [spikes, setSpikes] = useState([]);
  const [trending, setTrending] = useState([]);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [aRes, tRes] = await Promise.all([
          fetch("/api/analytics"),
          fetch("/api/trending"),
        ]);
        const a = await aRes.json();
        const t = await tRes.json();
        if (!cancelled) {
          setAnalytics(a.analytics);
          setSpikes(a.spikes || []);
          setTrending(t.items || []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
    const i = setInterval(load, 90000);
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-10 space-y-4">
      {/* Stats + Spikes full width */}
      <TopBar analytics={analytics} spikes={spikes} />

      {/* Mobile toggle for insights */}
      <button
        onClick={() => setShowInsights(!showInsights)}
        className="lg:hidden w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-base font-bold text-white flex items-center justify-center gap-2"
      >
        📊 {showInsights ? "Sembunyikan Analisa" : "Lihat Analisa Lengkap"}
      </button>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <h2 className="text-lg font-black text-white mb-3 px-1 flex items-center gap-2">
            📰 Berita Terkini
          </h2>
          <NewsFeed />
        </div>
        <aside
          className={`lg:col-span-2 order-1 lg:order-2 ${
            showInsights ? "block" : "hidden lg:block"
          }`}
        >
          <div className="lg:sticky lg:top-[84px]">
            <InsightsSidebar analytics={analytics} trending={trending} />
          </div>
        </aside>
      </div>
    </div>
  );
}
