"use client";

import TomorrowFollowUp from "./TomorrowFollowUp";

function Bar({ label, value, max, color = "bg-rose-500", rank }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-base">
        <span className="text-gray-200 truncate flex items-center gap-1.5">
          {rank && <span className="text-gray-500 font-mono text-sm">{rank}.</span>}
          {label}
        </span>
        <span className="text-gray-400 tabular-nums shrink-0 ml-2 font-semibold">
          {value}
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
      <h3 className="flex items-center gap-2 text-base font-bold text-white mb-3">
        <span className="text-xl">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function InsightsSidebar({ analytics, trending }) {
  if (!analytics) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  const { byProvince, byType, hotRegions, viralDist, trendingKeywords } = analytics;
  const totalDist =
    viralDist.sangat + viralDist.potensi + viralDist.cukup + viralDist.normal || 1;
  const maxProv = Math.max(1, ...byProvince.map((p) => p.count));
  const maxType = Math.max(1, ...byType.map((t) => t.count));
  const maxRegion = Math.max(1, ...hotRegions.map((r) => r.count));

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-black text-white px-1 flex items-center gap-2">
        📊 Analisa Berita
      </h2>

      {/* Prediksi Follow Up */}
      <TomorrowFollowUp />

      {/* Viral distribution */}
      <Section title="Tingkat Viral" icon="🎯">
        <div className="space-y-2.5">
          <Bar label="🔥 Sangat Viral" value={viralDist.sangat} max={totalDist} color="bg-red-500" />
          <Bar label="🟠 Berpotensi" value={viralDist.potensi} max={totalDist} color="bg-orange-500" />
          <Bar label="🟡 Cukup Menarik" value={viralDist.cukup} max={totalDist} color="bg-yellow-500" />
          <Bar label="⚪ Biasa" value={viralDist.normal} max={totalDist} color="bg-gray-600" />
        </div>
      </Section>

      {/* Trending keywords */}
      {trendingKeywords && trendingKeywords.length > 0 && (
        <Section title="Kata Kunci Lagi Naik" icon="🔑">
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((k) => {
              const big = k.count >= 4;
              return (
                <span
                  key={k.keyword}
                  className={`px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/25 ${
                    big ? "text-base font-bold" : "text-sm font-medium"
                  }`}
                >
                  #{k.keyword}
                  <span className="text-gray-500 ml-1 text-sm">{k.count}</span>
                </span>
              );
            })}
          </div>
        </Section>
      )}

      {/* Hot regions */}
      {hotRegions.length > 0 && (
        <Section title="Wilayah Paling Banyak Diberitakan" icon="📍">
          <div className="space-y-2.5">
            {hotRegions.slice(0, 8).map((r, idx) => (
              <Bar
                key={r.key}
                rank={idx + 1}
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
      <Section title="Sebaran Provinsi" icon="🗺️">
        <div className="space-y-2.5">
          {byProvince.map((p) => (
            <Bar key={p.key} label={p.key} value={p.count} max={maxProv} color="bg-cyan-500" />
          ))}
        </div>
      </Section>

      {/* Per kategori */}
      {byType.length > 0 && (
        <Section title="Kategori Berita" icon="📂">
          <div className="space-y-2.5">
            {byType.map((t) => (
              <Bar key={t.key} label={t.key} value={t.count} max={maxType} color="bg-purple-500" />
            ))}
          </div>
        </Section>
      )}

      {/* Google Trends */}
      {trending && trending.length > 0 && (
        <Section title="Google Trends Indonesia" icon="🔥">
          <ul className="space-y-2">
            {trending.slice(0, 10).map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 group"
                >
                  <span className="text-sm font-mono text-gray-600 mt-0.5 shrink-0 w-5">
                    {idx + 1}
                  </span>
                  <span className="text-base text-gray-300 group-hover:text-pink-300 line-clamp-2 transition-colors">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Info */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-sm text-gray-400 space-y-1">
        <p className="text-gray-300 font-bold mb-1">Tentang Data</p>
        <p>📰 200+ portal terverifikasi Dewan Pers</p>
        <p>🗺️ 24 Kota & 70 Kabupaten</p>
        <p>⏱️ Berita maksimal 3 jam terakhir</p>
        <p>🔍 Sumber asli dilacak hingga 7 hari</p>
      </div>
    </div>
  );
}
