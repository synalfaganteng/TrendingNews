"use client";

export default function TrendingStrip({ keywords, trending }) {
  // Combine: trending keywords from analysis + Google Trends queries
  const items = [
    ...(keywords || []).map((k) => ({
      label: `#${k.keyword}`,
      count: k.count,
      type: "kw",
    })),
    ...(trending || []).slice(0, 15).map((t) => ({
      label: t.title,
      count: null,
      type: "gt",
    })),
  ];

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const looped = [...items, ...items];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-fuchsia-950/40 to-purple-950/40 border border-purple-500/20 py-2.5">
      <div className="flex items-center gap-1.5 px-3 sm:px-4 mb-1.5">
        <span className="text-base">🔥</span>
        <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-purple-300">
          Live Trending
        </span>
        <span className="text-[10px] text-gray-500">
          · Google Trends + Keyword Detection
        </span>
      </div>

      <div className="overflow-hidden no-scrollbar">
        <div className="flex animate-marquee whitespace-nowrap">
          {looped.map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 mx-1 py-1 text-xs"
            >
              {item.type === "kw" ? (
                <>
                  <span className="text-fuchsia-400 font-bold">{item.label}</span>
                  <span className="text-gray-500 text-[10px]">×{item.count}</span>
                </>
              ) : (
                <>
                  <span className="text-purple-300">📍 {item.label}</span>
                </>
              )}
              <span className="text-gray-700">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
