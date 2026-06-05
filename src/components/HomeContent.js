"use client";

import { useState, useEffect } from "react";
import StatsBar from "./StatsBar";
import SpikeFeed from "./SpikeFeed";
import TrendingStrip from "./TrendingStrip";
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
      } catch (err) {
        console.error("Load failed:", err);
      }
    }

    load();
    const interval = setInterval(load, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-4 space-y-4">
      {/* Stats Bar */}
      <StatsBar analytics={analytics} />

      {/* Trending Strip */}
      <TrendingStrip
        keywords={analytics?.trendingKeywords}
        trending={trending}
      />

      {/* Spike Feed (full width on top, mobile + desktop) */}
      {spikes.length > 0 && <SpikeFeed spikes={spikes} />}

      {/* Mobile insights toggle */}
      <button
        onClick={() => setShowInsights(!showInsights)}
        className="lg:hidden w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white flex items-center justify-center gap-2"
      >
        <span>📊</span>
        {showInsights ? "Sembunyikan Insights" : "Tampilkan Insights"}
      </button>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <NewsFeed />
        </div>
        <aside
          className={`lg:col-span-1 order-1 lg:order-2 ${
            showInsights ? "block" : "hidden lg:block"
          }`}
        >
          <div className="lg:sticky lg:top-[80px]">
            <InsightsSidebar analytics={analytics} trending={trending} />
          </div>
        </aside>
      </div>
    </div>
  );
}
