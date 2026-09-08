import PublicHeader from "../../../components/layout/PublicHeader/PublicHeader";
import HomeHero from "../../../features/home/components/HomeHero";

function Home() {
  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-on-surface)]">
      <PublicHeader />

      <main>
        <HomeHero />
      </main>
    </div>
  );
}

export default Home;
