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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        
        {/* LOGO */}
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

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/tools" className="hover:text-foreground transition-colors">
            All Tools
          </Link>
          <Link href="#privacy" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center space-x-4">
          <Link href="/tools" className="hidden md:block">
            <Button className="font-semibold px-6 rounded-full" size="sm">
              Open Tools
            </Button>
          </Link>

          {/* MOBILE NAV */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 py-8">
                <Link href="/" className="text-lg font-medium hover:text-primary">
                  Home
                </Link>
                <Link href="/tools" className="text-lg font-medium hover:text-primary">
                  All Tools
                </Link>
                <Link href="#privacy" className="text-lg font-medium hover:text-primary">
                  Privacy
                </Link>
                <div className="pt-4 border-t">
                  <Link href="/tools" className="w-full">
                    <Button className="w-full font-semibold rounded-full">
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
