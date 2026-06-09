import fs from "fs";
import path from "path";
import os from "os";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

function getCachePath(sort) {
  return path.join(os.tmpdir(), `feed-ai-cache-${sort}.json`);
}
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function generateFeedInsights(newsItems, sortType = "viral") {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key || !newsItems || newsItems.length === 0) return null;

  const cacheFile = getCachePath(sortType);

  // Cek cache
  try {
    if (fs.existsSync(cacheFile)) {
      const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
      if (Date.now() - cacheData.timestamp < CACHE_TTL) {
        return cacheData.data;
      }
    }
  } catch (err) {
    console.error("Feed AI cache read error:", err);
  }

  // Siapkan top 5 berita saja untuk konteks AI agar lebih cepat (<5 detik)
  const top5 = newsItems.slice(0, 5);
  const contextData = top5.map((item, i) => {
    return `ID: ${i}\nJudul: ${item.title}`;
  }).join("\n\n");

  const sortContext = sortType === "viral" 
    ? "Berita Paling Viral (Banyak dibahas portal berita)" 
    : "Berita Paling Baru (Baru saja dirilis)";

  const messages = [
    {
      role: "system",
      content: `Kamu adalah Asisten Jurnalis AI Senior yang bertugas menganalisis umpan (feed) berita saat ini.
Konteks Feed: ${sortContext}

Tugasmu:
1. Buat "summary" (ringkasan) singkat 1-2 kalimat (maks 30 kata) tentang topik apa yang sedang mendominasi/menjadi sorotan di feed berita ini secara keseluruhan.
2. Untuk setiap berita yang diberikan (dari ID 0 sampai 4), berikan "reason" (alasan) 1 kalimat singkat (maks 15 kata) kenapa berita ini penting atau menarik dibaca.
3. Berikan HANYA dalam format JSON dengan struktur:
{
  "summary": "Saat ini feed didominasi oleh ... dan ...",
  "reasons": {
    "0": "Melibatkan tokoh politik besar.",
    "1": "Berdampak langsung pada lalu lintas jalan tol.",
    "2": "Memicu perdebatan panas di media sosial."
  }
}`
    },
    {
      role: "user",
      content: `Berikut adalah 5 berita teratas di feed:\n\n${contextData}\n\nBerikan analisis JSON mu.`
    }
  ];

  const controller = new AbortController();
  // STRICT 6 second timeout to prevent Vercel 504 Gateway Timeout (10s limit)
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        max_tokens: 1000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      clearTimeout(timeout);
      console.error("Feed AI error:", res.status);
      return null;
    }

    const data = await res.json();
    clearTimeout(timeout);
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("DeepSeek feed-ai returned empty content");
      return null;
    }

    try {
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleanContent);
      
      // Petakan alasan dari indeks array ke link/URL berita agar mudah dicocokkan di frontend
      const mappedReasons = {};
      if (parsed.reasons) {
        for (const [idxStr, reason] of Object.entries(parsed.reasons)) {
          const idx = parseInt(idxStr, 10);
          if (!isNaN(idx) && top5[idx]) {
            mappedReasons[top5[idx].link] = reason;
          }
        }
      }

      const result = {
        summary: parsed.summary || "",
        reasons: mappedReasons,
      };

      // Simpan ke cache gracefully
      try {
        fs.writeFileSync(cacheFile, JSON.stringify({
          timestamp: Date.now(),
          data: result
        }));
      } catch (writeErr) {
        console.error("Gagal menulis cache feed-ai:", writeErr);
      }

      return result;
    } catch (parseErr) {
      console.error("Gagal memparsing JSON dari DeepSeek (feed-ai):", parseErr, content);
      return null;
    }
  } catch (err) {
    clearTimeout(timeout);
    return null;
  }
}
