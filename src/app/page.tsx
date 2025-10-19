import HeroSection from "@/components/HeroSection";
import FeaturedNews from "@/components/FeaturedNews";
import TechNews from "@/components/TechNews";
import Ads from "@/components/Ads";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* Featured News */}
          <section className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-flash-primary/5 via-transparent to-flash-accent/5 rounded-3xl -mx-8 -my-8"></div>
            <div className="relative">
              <FeaturedNews />
            </div>
          </section>

          {/* Banner Ad */}
          <section className="flex justify-center">
            <div className="w-full max-w-4xl">
              <Ads className="w-full rounded-2xl shadow-xl" />
            </div>
          </section>

          {/* Technology Section */}
          <section>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-flash-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💻</span>
                </div>
                <h2 className="text-4xl text-white font-headline font-bold">
                  Technology
                </h2>
              </div>
              <div className="w-24 h-1 bg-flash-gradient rounded-full mx-auto"></div>
              <p className="text-flash-muted mt-4 max-w-2xl mx-auto">
                Cutting-edge innovations and tech breakthroughs shaping our
                future
              </p>
            </div>
            <TechNews />
          </section>
        </div>
      </div>
    </div>
  );
}
