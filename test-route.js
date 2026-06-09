import { GET } from "./src/app/api/news/route.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  const req = { url: "http://localhost/api/news?limit=10" };
  const res = await GET(req);
  const data = await res.json();
  
  const originals = data.items.filter(i => i.originalSource != null);
  const firsts = data.items.filter(i => i.isOriginal === true);
  
  console.log(`Total: ${data.items.length}`);
  console.log(`Originals found: ${originals.length}`);
  console.log(`Firsts (isOriginal): ${firsts.length}`);
}
run();
