import Hero from "@/components/home/Hero";
import FeaturedItems from "@/components/home/FeaturedItems";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesStrip from "@/components/home/FeaturesStrip";
import CtaSection from "@/components/home/CtaSection";

export default function HomePage() {
  return (
    <div className="space-y-8 sm:space-y-12 lg:space-y-16">
      <Hero />
      <FeaturedItems />
      <HowItWorks />
      <FeaturesStrip />
      <CtaSection />
    </div>
  );
}
