/**
 * DeepSeek LLM Client
 *
 * Dipakai SELEKTIF untuk verifikasi apakah dua berita benar-benar sama.
 * - Hanya dipanggil untuk kandidat yang sudah lolos pre-filter (hemat biaya)
 * - Hasil di-cache
 * - Kalau API key tidak ada / error → return null (fallback ke logika keyword)
 *
 * API key diambil dari environment variable DEEPSEEK_API_KEY.
 * JANGAN hardcode key di sini.
 */

const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export function isDeepSeekEnabled() {
  return !!process.env.DEEPSEEK_API_KEY;
}

/**
 * Panggil DeepSeek chat completion (JSON mode)
 */
async function callDeepSeek(messages, { maxTokens = 200, temperature = 0 } = {}) {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

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
        max_tokens: maxTokens,
        temperature,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.error("DeepSeek error:", res.status);
      return null;
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  } catch (err) {
    clearTimeout(timeout);
    return null;
  }
}

/**
 * Verifikasi: apakah berita A (yang ditampilkan) dan berita B (kandidat original)
 * membahas PERISTIWA YANG SAMA?
 *
 * @returns {Promise<{same: boolean, confidence: number} | null>}
 */
export async function verifySameStory(articleA, articleB) {
  const messages = [
    {
      role: "system",
      content:
        "Kamu adalah verifikator berita. Tugasmu menentukan apakah dua berita membahas PERISTIWA yang SAMA PERSIS (sama 5W1H: siapa, apa, di mana, kapan, kenapa, bagaimana). Berita yang topiknya mirip tapi peristiwa/kejadiannya berbeda dianggap TIDAK sama. Jawab HANYA dalam JSON: {\"same\": true/false, \"confidence\": 0-100}.",
    },
    {
      role: "user",
      content: `Berita A:
Judul: ${articleA.title}
Isi: ${(articleA.snippet || "").slice(0, 400)}

Berita B:
Judul: ${articleB.title}
Isi: ${(articleB.snippet || "").slice(0, 400)}

Apakah keduanya membahas peristiwa yang sama persis?`,
    },
  ];

  const result = await callDeepSeek(messages, { maxTokens: 60 });
  if (!result || typeof result.same !== "boolean") return null;

  return {
    same: result.same,
    confidence: typeof result.confidence === "number" ? result.confidence : 50,
  };
}
