/**
 * Follow-up Predictor using DeepSeek LLM with Caching
 */

import fs from "fs";
import path from "path";
import os from "os";

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";
const CACHE_FILE = path.join(os.tmpdir(), "followup-cache.json");
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours

export async function predictFollowUp(topSpikes) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return null;

  if (!topSpikes || topSpikes.length === 0) {
    return [];
  }

  // Check cache first
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const cacheData = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
      if (Date.now() - cacheData.timestamp < CACHE_TTL) {
        console.log("Serving Follow-Up from Cache");
        return cacheData.predictions;
      }
    }
  } catch (err) {
    console.error("Cache read error:", err);
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
1. Analisa hingga 20 tren berita hari ini yang diberikan.
2. Prediksi 10 hingga 20 peristiwa lanjutan atau sudut pandang berita untuk esok hari berdasarkan tren tersebut. Buatlah prediksi yang tajam dan masuk akal.
3. Berikan "score" (0-100) yang merepresentasikan seberapa layak/besar kemungkinan berita ini harus di-follow up besok. Berikan juga "scoreLabel" (misal: "Sangat Layak", "Layak", "Biasa").
4. Berikan jawaban HANYA dalam format JSON dengan struktur:
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
  const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout for long generation

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

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("DeepSeek Predictor error:", res.status);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    try {
      const parsed = JSON.parse(content);
      const predictions = parsed.predictions || [];
      
      // Save to cache
      if (predictions.length > 0) {
        fs.writeFileSync(CACHE_FILE, JSON.stringify({
          timestamp: Date.now(),
          predictions
        }));
      }

      return predictions;
    } catch {
      return null;
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error("Predictor fetch failed", err);
    return null;
  }
}
