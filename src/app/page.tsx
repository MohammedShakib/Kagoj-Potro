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
        <section className="relative px-4 pb-16 pt-10 text-center sm:pt-16">
          <div className="container mx-auto max-w-6xl space-y-8">
            <div className="space-y-4">
              <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-[inset_0_-8px_10px_#8eaebf1f] backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
                <p className="text-sm font-semibold text-primary uppercase tracking-widest">
                  100% PRIVATE • BROWSER BASED
                </p>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                Convert PDF to JPG, <br className="hidden sm:inline" />
                without uploading your files.
              </h1>
              
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Convert every PDF page into a high-quality JPG directly in your browser.
              </p>

              <div className="flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground pt-2">
                <span>No uploads</span>
                <span>·</span>
                <span>No signup</span>
                <span>·</span>
                <span>Free</span>
              </div>
            </div>
            
            <div className="pt-6 mx-auto max-w-3xl">
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
