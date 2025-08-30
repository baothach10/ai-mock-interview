import Header from "./_components/Header";
import HeroSection from "./_components/HeroSection";

export default function Home() {
  return (
    <div className="relative w-full h-full">
      {/* Header */}
      <Header />
      {/* Hero */}
      <HeroSection />
    </div>
  );
}
