import { fetchAllNews } from "@/src/lib/fetcher";
import { attachViralScores } from "@/src/lib/viral-scorer";
import { detectSpikes } from "@/src/lib/analytics";
import { predictFollowUp } from "@/src/lib/predictor";

export const revalidate = 60;
export const maxDuration = 60;

export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send whitespace immediately to bypass Vercel 10s execution limit (First byte sent)
      controller.enqueue(encoder.encode(" "));
      
      try {
        let news = await fetchAllNews();
        news = attachViralScores(news);
        const spikes = detectSpikes(news);

        // Ambil top 20 topik paling viral hari ini
        const topSpikes = spikes.slice(0, 20);

        const predictions = await predictFollowUp(topSpikes);

        if (!predictions) {
          controller.enqueue(encoder.encode(JSON.stringify({ error: "Gagal mendapatkan prediksi dari AI" })));
        } else {
          controller.enqueue(encoder.encode(JSON.stringify({
            lastUpdated: new Date().toISOString(),
            predictions,
          })));
        }
      } catch (error) {
        console.error("Follow-Up API Error:", error);
        controller.enqueue(encoder.encode(JSON.stringify({ error: "Internal Server Error" })));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    },
  });
}
