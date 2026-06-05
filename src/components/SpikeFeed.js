"use client";

export default function SpikeFeed({ spikes }) {
  if (!spikes || spikes.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-red-950/50 to-pink-950/30 border border-red-500/20 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">📈</span>
        <div>
          <h2 className="font-black text-white text-base sm:text-lg">
            Spike Topik
          </h2>
          <p className="text-xs text-gray-400">
            Topik yang banyak diberitakan secara bersamaan
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {spikes.slice(0, 5).map((spike, idx) => (
          <a
            key={idx}
            href={spike.representative?.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/40 hover:bg-black/60 transition-all group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  {spike.keywords.slice(0, 4).map((kw) => (
                    <span
                      key={kw}
                      className="text-[10px] px-1.5 py-0.5 rounded-md bg-red-500/15 text-red-300 border border-red-500/20 font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-white font-medium line-clamp-2 group-hover:text-red-300 transition-colors">
                  {spike.representative?.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="text-orange-400">●</span>
                    {spike.sourceCount} portal
                  </span>
                  <span>·</span>
                  <span>{spike.articleCount} artikel</span>
                </div>
              </div>
              <div className="shrink-0">
                <div className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-center">
                  <p className="text-[9px] text-red-300 font-bold uppercase">
                    Intensitas
                  </p>
                  <p className="text-base font-black text-red-300 leading-none">
                    {spike.intensity}
                  </p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
