import NewsFeed from "@/src/components/NewsFeed";
import TrendingSidebar from "@/src/components/TrendingSidebar";
import Header from "@/src/components/Header";

export const revalidate = 30;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <NewsFeed />
        </div>
        <aside className="lg:col-span-1">
          <TrendingSidebar />
        </aside>
      </div>
    </main>
  );
}
