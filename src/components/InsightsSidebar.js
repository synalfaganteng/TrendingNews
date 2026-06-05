"use client";

function MiniBar({ label, value, max, color = "bg-rose-500" }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-300 truncate">{label}</span>
        <span className="text-gray-500 tabular-nums shrink-0 ml-2">{value}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3">
      <h3 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function InsightsSidebar({ analytics }) {
  if (!analytics) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  const { byProvince, byType, hotRegions, trendingKeywords } = analytics;
  const maxProv = Math.max(1, ...byProvince.map((p) => p.count));
  const maxType = Math.max(1, ...byType.map((t) => t.count));
  const maxRegion = Math.max(1, ...hotRegions.map((r) => r.count));

  return (
    <div className="space-y-2">
      {/* Trending keywords — wordcloud-ish */}
      {trendingKeywords && trendingKeywords.length > 0 && (
        <Section title="Keyword Lagi Naik">
          <div className="flex flex-wrap gap-1">
            {trendingKeywords.map((k) => {
              const size =
                k.count >= 5 ? "text-base font-black" :
                k.count >= 3 ? "text-sm font-bold" :
                "text-xs font-medium";
              return (
                <span
                  key={k.keyword}
                  className={`${size} text-pink-300 px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20`}
                >
                  #{k.keyword}
                  <span className="text-[10px] text-gray-500 ml-1">×{k.count}</span>
                </span>
              );
            })}
          </div>
        </Section>
      )}

      {/* Hot regions */}
      {hotRegions.length > 0 && (
        <Section title="Wilayah Panas">
          <div className="space-y-1.5">
            {hotRegions.slice(0, 8).map((r) => (
              <MiniBar
                key={r.key}
                label={r.key}
                value={r.count}
                max={maxRegion}
                color="bg-emerald-500"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Per provinsi */}
      <Section title="Per Provinsi">
        <div className="space-y-1.5">
          {byProvince.map((p) => (
            <MiniBar
              key={p.key}
              label={p.key}
              value={p.count}
              max={maxProv}
              color="bg-cyan-500"
            />
          ))}
        </div>
      </Section>

      {/* Per type */}
      {byType.length > 0 && (
        <Section title="Kategori">
          <div className="space-y-1.5">
            {byType.map((t) => (
              <MiniBar
                key={t.key}
                label={t.key}
                value={t.count}
                max={maxType}
                color="bg-purple-500"
              />
            ))}
          </div>
        </Section>
      )}

      <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3 text-[10px] text-gray-500">
        <p>📰 200+ portal · Dewan Pers</p>
        <p>🗺️ 24 Kota · 70 Kab. di 5 Provinsi</p>
        <p>⏱️ Pool dedup: 7 hari</p>
      </div>
    </div>
  );
}
