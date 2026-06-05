"use client";

export default function TopBar({ analytics, spikes }) {
  if (!analytics) {
    return (
      <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
    );
  }

  return (
    <div className="space-y-2">
      {/* Compact stats — single row */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs overflow-x-auto no-scrollbar">
        <span className="shrink-0">
          <span className="text-gray-500">Total:</span>{" "}
          <strong className="text-white">{analytics.total}</strong>
        </span>
        <span className="text-gray-700 shrink-0">·</span>
        <span className="shrink-0">
          <span className="text-gray-500">Viral:</span>{" "}
          <strong className="text-orange-400">
            {analytics.highPotentialCount}
          </strong>
        </span>
        <span className="text-gray-700 shrink-0">·</span>
        <span className="shrink-0">
          <span className="text-gray-500">🔥 Sangat:</span>{" "}
          <strong className="text-red-400">{analytics.viralDist.sangat}</strong>
        </span>
        {spikes && spikes.length > 0 && (
          <>
            <span className="text-gray-700 shrink-0">·</span>
            <span className="shrink-0">
              <span className="text-gray-500">📈 Spike:</span>{" "}
              <strong className="text-pink-400">{spikes.length}</strong> topik
            </span>
          </>
        )}
      </div>

      {/* Spike strip — clickable */}
      {spikes && spikes.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {spikes.slice(0, 6).map((spike, idx) => (
            <a
              key={idx}
              href={spike.representative?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-3 py-2 rounded-xl bg-gradient-to-br from-red-950/50 to-pink-950/30 border border-red-500/30 hover:border-red-500/60 transition-colors min-w-[200px] max-w-[280px]"
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="text-[10px] text-red-400 font-bold">
                  📈 {spike.sourceCount} portal
                </span>
                <span className="text-[10px] text-gray-500">
                  · {spike.articleCount} artikel
                </span>
              </div>
              <p className="text-xs text-white font-medium line-clamp-2 leading-snug">
                {spike.representative?.title}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
