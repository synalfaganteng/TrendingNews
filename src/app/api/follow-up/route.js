import { detectSpikes } from "@/src/lib/analytics";
import { predictFollowUp } from "@/src/lib/predictor";
import { serpSearchCandidates } from "@/src/lib/serp-finder";

export const runtime = 'edge'; // Edge runtime gives 25s timeout on Hobby!
export const revalidate = 0; // Dynamic

export async function GET(request) {
  try {
    const origin = new URL(request.url).origin;
    // Fetch news from our own API to avoid Node.js core modules in Edge runtime!
    const newsRes = await fetch(`${origin}/api/news?limit=100&skipOrigin=true`, { 
      cache: "no-store" 
    });
    
    if (!newsRes.ok) {
      throw new Error("Failed to fetch news from API");
    }

    const data = await newsRes.json();
    const news = data.items || [];
    
    const spikes = detectSpikes(news);
    const topSpikes = spikes.slice(0, 20);

    const predictions = await predictFollowUp(topSpikes);

    if (!predictions) {
      return Response.json(
        { error: "Gagal mendapatkan prediksi dari AI" },
        { status: 500 }
      );
    }

    // Gunakan Serper API untuk mencari apakah Top 10 prediksi ini sudah diliput media
    // (Jauh lebih hemat API karena hanya max 10 pencarian di satu halaman khusus)
    const top10 = predictions.slice(0, 10);
    const searchPromises = top10.map(async (pred) => {
      try {
        // Cari pakai Serper API. Fallback organik diizinkan agar pencarian lebih luas.
        const results = await serpSearchCandidates(pred.title, { allowSearchFallback: true });
        if (results && results.length > 0) {
          // Ambil hasil pertama yang valid
          pred.realWorldMatch = results[0];
        }
      } catch (err) {
        // Abaikan jika error (misal timeout) agar tidak merusak prediksi
      }
    });

    // Jalankan 10 pencarian Serper secara serentak
    await Promise.all(searchPromises);

    return Response.json({
      lastUpdated: new Date().toISOString(),
      predictions,
    });
  } catch (error) {
    console.error("Follow-Up API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
