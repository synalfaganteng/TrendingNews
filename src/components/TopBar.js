"use client";

function StatBox({ label, value, sub, color, icon }) {
  const colors = {
    cyan: "from-cyan-500/15 to-blue-500/10 border-cyan-500/30",
    orange: "from-orange-500/15 to-amber-500/10 border-orange-500/30",
    red: "from-red-500/15 to-pink-500/10 border-red-500/30",
    purple: "from-purple-500/15 to-fuchsia-500/10 border-purple-500/30",
  };
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${colors[color]} border p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-300">{label}</span>
      </div>
      <p className="text-3xl font-black text-white tabular-nums">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function TopBar({ analytics, spikes }) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatBox
          label="Total Berita"
          value={analytics.total}
          sub="3 jam terakhir"
          color="cyan"
          icon="📰"
        />
        <StatBox
          label="Berpotensi Viral"
          value={analytics.highPotentialCount}
          sub="skor 55 ke atas"
          color="orange"
          icon="🔥"
        />
        <StatBox
          label="Sangat Viral"
          value={analytics.viralDist.sangat}
          sub="skor 75 ke atas"
          color="red"
          icon="🚀"
        />
        <StatBox
          label="Topik Spike"
          value={spikes ? spikes.length : 0}
          sub="banyak portal nulis"
          color="purple"
          icon="📈"
        />
      </div>

      {/* Spike cards */}
      {spikes && spikes.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-red-950/40 to-pink-950/20 border border-red-500/20 p-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-3">
            <span>📈</span> Topik Sedang Ramai
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {spikes.slice(0, 4).map((spike, idx) => (
              <a
                key={idx}
                href={spike.representative?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-xl bg-black/40 border border-white/10 hover:border-red-500/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-red-500/20 text-red-300 text-sm font-bold">
                    {spike.sourceCount} portal
                  </span>
                  <span className="text-sm text-gray-400">
                    {spike.articleCount} artikel
                  </span>
                </div>
                <p className="text-sm font-medium text-white line-clamp-2 leading-snug">
                  {spike.representative?.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
