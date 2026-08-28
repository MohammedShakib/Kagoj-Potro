import { Navbar } from "@/components/kagoj-potro/navbar";
import { ConverterCard } from "@/components/kagoj-potro/converter-card";
import { FeaturesSection } from "@/components/kagoj-potro/features-section";
import { HowItWorks } from "@/components/kagoj-potro/how-it-works";
import { Footer } from "@/components/kagoj-potro/footer";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to JPG Converter | Kagoj Potro",
  description: "Convert PDF pages to high-quality JPG images directly in your browser with Kagoj Potro. Fast, private and no upload required.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 pb-16 pt-20 text-center sm:pt-28">
          <div className="container mx-auto max-w-4xl space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                Convert PDF to JPG <br className="hidden sm:inline" />
                <span className="text-primary">— Fast, Private & Free</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Turn every PDF page into a high-quality JPG directly in your browser. 
                Your files never leave your device.
              </p>
            </div>
            
            <div className="pt-8">
              <ConverterCard />
            </div>
          </div>
        </section>

        <FeaturesSection />
        <HowItWorks />
      </main>
      
      <Footer />
      <Toaster position="bottom-center" />
    </div>
  );
}
