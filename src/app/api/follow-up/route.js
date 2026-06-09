import { detectSpikes } from "@/src/lib/analytics";
import { predictFollowUp } from "@/src/lib/predictor";

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

    return Response.json({
      lastUpdated: new Date().toISOString(),
      predictions,
    });
  } catch (error) {
    console.error("Follow-Up API Error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
