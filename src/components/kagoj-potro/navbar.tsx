import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="container mx-auto max-w-[1200px] flex h-18 items-center justify-between px-4 sm:px-6 md:px-8">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/kagoj-potro-icon-transparent.png"
            alt="Kagoj Potro"
            width={913}
            height={861}
            className="h-9 w-auto sm:hidden transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-xl font-bold tracking-tight sm:hidden text-foreground group-hover:text-primary transition-colors">Kagoj Potro</span>
          <Image
            src="/kagoj-potro-full-logo-transparent.png"
            alt="Kagoj Potro"
            width={1616}
            height={336}
            className="hidden h-11 w-auto sm:block transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/tools" className="hover:text-primary transition-colors">
            All Tools
          </Link>
          <Link href="#privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-4">
          <Link href="/tools" className="hidden md:block">
            <Button className="font-bold px-6 h-12 rounded-xl bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 transition-all shadow-sm hover:shadow-md" size="default">
              Open Tools
            </Button>
          </Link>

          {/* MOBILE NAV */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-slate-600 hover:text-primary hover:bg-primary/10" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] border-l-0 shadow-2xl p-8">
              <div className="flex flex-col gap-8 mt-10">
                <Link href="/" className="text-xl font-bold text-slate-800 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/tools" className="text-xl font-bold text-slate-800 hover:text-primary transition-colors">
                  All Tools
                </Link>
                <Link href="#privacy" className="text-xl font-bold text-slate-800 hover:text-primary transition-colors">
                  Privacy
                </Link>
                <div className="pt-8 border-t border-slate-100">
                  <Link href="/tools" className="w-full">
                    <Button className="w-full font-bold h-14 rounded-xl text-lg bg-primary text-white shadow-md">
                      Open Tools
                    </Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
