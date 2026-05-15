import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustMarquee } from "@/components/TrustMarquee";
import { LoanProducts } from "@/components/LoanProducts";
import { HowItWorks } from "@/components/HowItWorks";
import { CIBILGauge } from "@/components/CIBILGauge";
import { EMICalculator } from "@/components/EMICalculator";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <TrustMarquee />
      <LoanProducts />
      <HowItWorks />
      <CIBILGauge />
      <EMICalculator />
      <Testimonials />
      <Footer />
    </main>
  );
}
