/**
 * Follow-up Predictor using DeepSeek LLM
 */

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export async function predictFollowUp(topSpikes) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return null;

  if (!topSpikes || topSpikes.length === 0) {
    return [];
  }

  // Siapkan data berita hari ini
  const contextData = topSpikes.map((spike, i) => {
    return `${i + 1}. Topik: ${spike.keywords.join(", ")}\nJudul: ${
      spike.representative?.title || "Tidak ada judul"
    }\nBerita ini diliput oleh ${spike.sourceCount} sumber berbeda hari ini.`;
  }).join("\n\n");

  const messages = [
    {
      role: "system",
      content: `Kamu adalah Editor Berita Senior dan Analis Prediktif yang ahli melihat tren berita hari ini untuk memprediksi sudut pandang (angle) berita atau kejadian lanjutan (follow-up) esok hari.
Tugasmu:
1. Analisa tren berita hari ini yang diberikan.
2. Prediksi 3 hingga 5 peristiwa lanjutan atau sudut pandang berita untuk esok hari berdasarkan tren tersebut. (Contoh: jika hari ini gempa, besok beritanya tentang penyaluran bantuan atau korban jiwa. Jika hari ini timnas kalah, besok beritanya tentang evaluasi pelatih atau peluang ke babak selanjutnya).
3. Berikan jawaban HANYA dalam format JSON dengan struktur:
{
  "predictions": [
    {
      "title": "Judul Prediksi Singkat",
      "description": "Penjelasan singkat mengapa ini akan jadi berita besok dan apa sudut pandangnya."
    }
  ]
}`
    },
    {
      role: "user",
      content: `Berikut adalah berita paling trending (viral) di Sumatera hari ini (00:00 - 24:00):\n\n${contextData}\n\nBerikan prediksi follow-up untuk besok dalam format JSON.`
    }
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout for complex generation

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
        max_tokens: 500,
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
      return parsed.predictions || [];
    } catch {
      return null;
    }
  } catch (err) {
    clearTimeout(timeout);
    console.error("Predictor fetch failed", err);
    return null;
  }
}
