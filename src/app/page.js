import Header from "@/src/components/Header";
import HomeContent from "@/src/components/HomeContent";

export const revalidate = 30;

export default function Home() {
  return (
    <main className="min-h-screen pb-12">
      <Header />
      <HomeContent />
    </main>
  );
}
