import { fetchAllNews } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
import { detectSpikes } from "@/src/lib/analytics";
import { predictFollowUp } from "@/src/lib/predictor";

export const revalidate = 60;
export const runtime = 'edge'; // Edge runtime gives 25s timeout on Hobby!

export async function GET() {
  try {
    let news = await fetchAllNews();
    news = attachViralScores(news);
    const spikes = detectSpikes(news);

    // Ambil top 20 topik paling viral hari ini
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
