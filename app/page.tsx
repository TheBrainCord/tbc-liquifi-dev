import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LiveActivityTicker } from "@/components/LiveActivityTicker";
import { TrustMarquee } from "@/components/TrustMarquee";
import { LoanProducts } from "@/components/LoanProducts";
import { HowItWorks } from "@/components/HowItWorks";
import { CIBILGauge } from "@/components/CIBILGauge";
import { EMICalculator } from "@/components/EMICalculator";
import { Testimonials } from "@/components/Testimonials";
import { ExpertCallSection } from "@/components/ExpertCallSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <LiveActivityTicker />
      <Navbar />
      <HeroSection />
      <TrustMarquee />
      <LoanProducts />
      <HowItWorks />
      <CIBILGauge />
      <EMICalculator />
      <Testimonials />
      <ExpertCallSection />
      <Footer />
    </main>
  );
}
