import { Hero } from "@/components/home/hero";
import { PopularTools } from "@/components/home/popular-tools";
import { PrivacyStrip } from "@/components/home/privacy-strip";
import { AllTools } from "@/components/home/all-tools";
import { HowItWorks } from "@/components/kagoj-potro/how-it-works";
import { PrivacySection } from "@/components/home/privacy-section";
import { FutureToolsCTA } from "@/components/home/future-tools-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <PopularTools />
      <PrivacyStrip />
      <AllTools />
      <HowItWorks />
      <PrivacySection />
      <FutureToolsCTA />
    </>
  );
}
