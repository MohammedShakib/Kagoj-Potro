import Link from "next/link";
import { FileImage } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <FileImage className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight">Kagoj Potro</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="#tools" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Tools
          </Link>
          <Link href="#privacy" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            Privacy
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
            About
          </Link>
          <Link href="/" className={buttonVariants({ variant: "default", size: "sm" })}>Convert PDF</Link>
        </nav>
      </div>
    </header>
  );
}
