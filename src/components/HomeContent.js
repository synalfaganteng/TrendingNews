"use client";

import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import NewsFeed from "./NewsFeed";
import InsightsSidebar from "./InsightsSidebar";

export default function HomeContent() {
  const [analytics, setAnalytics] = useState(null);
  const [spikes, setSpikes] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const r = await fetch("/api/analytics");
        const j = await r.json();
        if (!cancelled) {
          setAnalytics(j.analytics);
          setSpikes(j.spikes || []);
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
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pt-3 pb-8">
      <TopBar analytics={analytics} spikes={spikes} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-3">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <NewsFeed />
        </div>
        <aside className="lg:col-span-1 order-1 lg:order-2">
          <div className="lg:sticky lg:top-[64px]">
            <InsightsSidebar analytics={analytics} />
          </div>
        </aside>
      </div>
    </div>
  );
}
