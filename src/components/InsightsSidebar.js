"use client";

function Bar({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-300 truncate">{label}</span>
        <span className="text-gray-500 tabular-nums shrink-0 ml-2">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
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
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
        <span>{icon}</span>
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
          <div
            key={i}
            className="animate-pulse h-40 rounded-2xl bg-white/5 border border-white/10"
          />
        ))}
      </div>
    );
  }

  const { byProvince, byType, byPlatform, hotRegions, viralDist } = analytics;
  const maxProvince = Math.max(1, ...byProvince.map((p) => p.count));
  const maxType = Math.max(1, ...byType.map((t) => t.count));
  const maxPlatform = Math.max(1, ...byPlatform.map((p) => p.count));
  const maxRegion = Math.max(1, ...hotRegions.map((r) => r.count));

  return (
    <div className="space-y-3">
      {/* Viral distribution donut-like */}
      <Section title="Distribusi Viral" icon="🎯">
        <div className="space-y-2">
          <Bar
            label="🔥 Sangat Viral (≥75)"
            value={viralDist.sangat}
            max={Math.max(1, viralDist.sangat + viralDist.potensi + viralDist.cukup + viralDist.normal)}
            color="bg-gradient-to-r from-red-500 to-pink-500"
          />
          <Bar
            label="🟠 Berpotensi (≥55)"
            value={viralDist.potensi}
            max={Math.max(1, viralDist.sangat + viralDist.potensi + viralDist.cukup + viralDist.normal)}
            color="bg-gradient-to-r from-orange-500 to-yellow-500"
          />
          <Bar
            label="🟡 Cukup (≥35)"
            value={viralDist.cukup}
            max={Math.max(1, viralDist.sangat + viralDist.potensi + viralDist.cukup + viralDist.normal)}
            color="bg-gradient-to-r from-yellow-500 to-amber-500"
          />
          <Bar
            label="⚪ Normal"
            value={viralDist.normal}
            max={Math.max(1, viralDist.sangat + viralDist.potensi + viralDist.cukup + viralDist.normal)}
            color="bg-gradient-to-r from-gray-600 to-gray-500"
          />
        </div>
      </Section>

      {/* Hot Regions */}
      {hotRegions.length > 0 && (
        <Section title="Wilayah Paling Panas" icon="📍">
          <div className="space-y-2">
            {hotRegions.slice(0, 8).map((r, idx) => (
              <Bar
                key={r.key}
                label={`${idx + 1}. ${r.key}`}
                value={r.count}
                max={maxRegion}
                color="bg-gradient-to-r from-emerald-500 to-cyan-500"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Per Provinsi */}
      <Section title="Per Provinsi" icon="🗺️">
        <div className="space-y-2">
          {byProvince.map((p) => (
            <Bar
              key={p.key}
              label={p.key}
              value={p.count}
              max={maxProvince}
              color="bg-gradient-to-r from-cyan-500 to-blue-500"
            />
          ))}
        </div>
      </Section>

      {/* Per Content Type */}
      {byType.length > 0 && (
        <Section title="Kategori Konten" icon="📂">
          <div className="space-y-2">
            {byType.map((t) => (
              <Bar
                key={t.key}
                label={t.key}
                value={t.count}
                max={maxType}
                color="bg-gradient-to-r from-purple-500 to-fuchsia-500"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Best Platform Match */}
      {byPlatform.length > 0 && (
        <Section title="Cocok di Platform" icon="📱">
          <div className="space-y-2">
            {byPlatform.map((p) => (
              <Bar
                key={p.key}
                label={p.key}
                value={p.count}
                max={maxPlatform}
                color="bg-gradient-to-r from-pink-500 to-rose-500"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Google Trends */}
      {trending && trending.length > 0 && (
        <Section title="Google Trends ID" icon="🔥">
          <ul className="space-y-1.5">
            {trending.slice(0, 12).map((item, idx) => (
              <li key={idx}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <span className="text-[10px] font-mono text-gray-600 mt-0.5 shrink-0 w-5">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="text-xs text-gray-300 group-hover:text-pink-300 line-clamp-2 transition-colors">
                    {item.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Footer info */}
      <div className="rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 p-4 text-[10px] text-gray-500 space-y-1">
        <p className="text-gray-400 font-bold">Cakupan Data</p>
        <p>📰 200+ portal terverifikasi Dewan Pers</p>
        <p>🗺️ 24 Kota · 70 Kabupaten</p>
        <p>⏱️ Pool dedup: 7 hari ke belakang</p>
        <p>🤖 Auto-detect spike + scoring AI</p>
      </div>
    </div>
  );
}
