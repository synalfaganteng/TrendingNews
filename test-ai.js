import { predictFollowUp } from "./src/lib/predictor.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const mockSpikes = [
  {
    keywords: ["kecelakaan", "maut"],
    representative: { title: "Kecelakaan beruntun di Tol Trans Sumatera tewaskan 3 orang" },
    sourceCount: 5,
    intensity: 80
  },
  {
    keywords: ["banjir", "bandang"],
    representative: { title: "Banjir melanda kota Medan setelah hujan lebat" },
    sourceCount: 3,
    intensity: 60
  }
];

async function run() {
  console.log("Running predictFollowUp...");
  const res = await predictFollowUp(mockSpikes);
  console.log("Result:", res);
}
run();
