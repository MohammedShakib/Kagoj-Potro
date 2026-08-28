import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/kagoj-potro-icon-transparent.png"
            alt="Kagoj Potro"
            width={913}
            height={861}
            className="h-9 w-auto sm:hidden"
          />
          <span className="text-lg font-bold tracking-tight sm:hidden text-primary">Kagoj Potro</span>
          <Image
            src="/kagoj-potro-full-logo-transparent.png"
            alt="Kagoj Potro"
            width={1616}
            height={336}
            className="hidden h-10 w-auto sm:block"
          />
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="#tools" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Tools
          </Link>
          <Link href="#how-it-works" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            How it Works
          </Link>
          <Link href="#privacy" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Privacy
          </Link>
          <Link href="/" className={buttonVariants({ variant: "default", size: "sm" })}>
            Convert PDF
          </Link>
        </nav>
      </div>
    </header>
  );
}
