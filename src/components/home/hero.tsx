import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-10 text-center sm:pt-20">
      <div className="container mx-auto max-w-5xl space-y-8">
        <div className="space-y-6">
          <div className="mx-auto flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-6 py-2 shadow-sm backdrop-blur transition-all">
            <p className="text-xs font-bold text-primary uppercase tracking-widest">
              FAST • PRIVATE • BROWSER-BASED
            </p>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground leading-[1.1]">
            Everyday document tools,
            <br className="hidden sm:inline" /> right in your browser.
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Convert, merge, split and organize your documents without sending your files to a server.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/tools">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg font-semibold w-full sm:w-auto">
              Choose a Tool
            </Button>
          </Link>
          <Link href="/tools/pdf-to-jpg">
            <Button variant="outline" size="lg" className="h-14 px-8 rounded-full text-lg font-semibold w-full sm:w-auto">
              PDF to JPG
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground pt-6">
          <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> No uploads</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> No signup</span>
          <span>·</span>
          <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Browser based</span>
        </div>
      </div>
    </section>
  );
}
