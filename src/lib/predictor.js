/**
 * Follow-up Predictor using DeepSeek LLM with Caching
 */

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

let memoryCache = { timestamp: 0, predictions: [] };
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

export async function predictFollowUp(topSpikes) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return null;

  if (!topSpikes || topSpikes.length === 0) {
    return [];
  }

  // Check cache first
  if (memoryCache.predictions.length > 0 && Date.now() - memoryCache.timestamp < CACHE_TTL) {
    console.log("Serving Follow-Up from Memory Cache");
    return memoryCache.predictions;
  }

  // Siapkan data berita hari ini
  const contextData = topSpikes.map((spike, i) => {
    return `${i + 1}. Topik: ${spike.keywords.join(", ")}\nJudul: ${
      spike.representative?.title || "Tidak ada judul"
    }\nSumber: Diliput oleh ${spike.sourceCount} portal.\nIntensitas: ${spike.intensity}`;
  }).join("\n\n");

  const messages = [
    {
      role: "system",
      content: `Kamu adalah Editor Berita Senior dan Analis Prediktif yang ahli melihat tren berita hari ini untuk memprediksi sudut pandang (angle) berita atau kejadian lanjutan (follow-up) esok hari.
Tugasmu:
1. Analisa tren berita hari ini yang diberikan.
2. Prediksi TEPAT 20 peristiwa lanjutan atau sudut pandang berita untuk esok hari. WAJIB BERIKAN 20 PREDIKSI.
3. Untuk mempercepat, "description" MAKSIMAL 15 KATA SAJA! Sangat singkat dan padat.
4. Berikan "score" (0-100) dan "scoreLabel" (misal: "Sangat Layak", "Layak").
5. Berikan jawaban HANYA format JSON:
{
  "predictions": [
    {
      "title": "Judul Prediksi Singkat",
      "description": "Penjelasan singkat mengapa ini akan jadi berita besok dan apa sudut pandangnya.",
      "score": 95,
      "scoreLabel": "Sangat Layak"
    }
  ]
}`
    },
    {
      role: "user",
      content: `Berikut adalah 20 berita paling trending di Sumatera hari ini:\n\n${contextData}\n\nBerikan prediksi follow-up untuk besok dalam format JSON. Urutkan dari score tertinggi ke terendah.`
    }
  ];

  const controller = new AbortController();
  // Edge runtime limit is 25s, so we can set timeout to 23s.
  const timeout = setTimeout(() => controller.abort(), 23000);

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
        max_tokens: 3000,
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      clearTimeout(timeout);
      console.error("DeepSeek Predictor error:", res.status);
      return null;
    }

    const data = await res.json();
    clearTimeout(timeout);
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("DeepSeek returned empty content");
      return null;
    }

    try {
      // Hilangkan wrapper markdown bawaan AI (misal ```json ... ```)
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleanContent);
      const predictions = parsed.predictions || [];
      
      // Save to memory cache
      if (predictions.length > 0) {
        memoryCache = {
          timestamp: Date.now(),
          predictions
        };
      }

      return predictions;
    } catch (parseErr) {
      console.error("Gagal memparsing JSON dari DeepSeek:", parseErr, content);
      return null;
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error("Predictor fetch failed", err);
    return null;
  }
}
