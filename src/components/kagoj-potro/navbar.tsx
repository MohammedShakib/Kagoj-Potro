import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm transition-all duration-300">
      <div className="container mx-auto max-w-[1240px] flex h-14 md:h-16 items-center justify-between px-4 sm:px-6">
        
        <div className="flex items-center gap-8">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/kagoj-potro-icon-transparent.png"
              alt="Kagoj Potro"
              width={913}
              height={861}
              className="h-8 w-auto sm:hidden transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-xl font-extrabold tracking-tight sm:hidden text-slate-800 group-hover:text-primary transition-colors">Kagoj Potro</span>
            <Image
              src="/kagoj-potro-full-logo-transparent.png"
              alt="Kagoj Potro"
              width={1616}
              height={336}
              className="hidden h-9 w-auto sm:block transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center space-x-1 text-sm font-semibold text-slate-700">
            <Link href="/tools/merge-pdf" className="hover:text-primary hover:bg-slate-50 px-3 py-2 rounded-md transition-colors">
              Merge PDF
            </Link>
            <Link href="/tools/split-pdf" className="hover:text-primary hover:bg-slate-50 px-3 py-2 rounded-md transition-colors">
              Split PDF
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary hover:bg-slate-50 px-3 py-2 rounded-md transition-colors outline-none focus:outline-none">
                Convert PDF <ChevronDown className="h-4 w-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 font-medium">
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/tools/pdf-to-jpg" className="w-full">PDF to JPG</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/tools/pdf-to-png" className="w-full">PDF to PNG</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Link href="/tools/image-to-pdf" className="w-full">Image to PDF</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/tools" className="hover:text-primary hover:bg-slate-50 px-3 py-2 rounded-md transition-colors">
              All Tools
            </Link>
          </nav>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-4 text-sm font-semibold text-slate-700">
            <Link href="#privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </nav>

          {/* MOBILE NAV */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden text-slate-700 hover:text-primary hover:bg-slate-100" />}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l-0 shadow-2xl p-6">
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-lg font-bold text-slate-800 hover:text-primary transition-colors">
                  Home
                </Link>
                <Link href="/tools/merge-pdf" className="text-lg font-bold text-slate-800 hover:text-primary transition-colors">
                  Merge PDF
                </Link>
                <Link href="/tools/split-pdf" className="text-lg font-bold text-slate-800 hover:text-primary transition-colors">
                  Split PDF
                </Link>
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Convert PDF</h4>
                  <div className="flex flex-col gap-3 pl-2">
                    <Link href="/tools/pdf-to-jpg" className="text-base font-bold text-slate-700 hover:text-primary transition-colors">
                      PDF to JPG
                    </Link>
                    <Link href="/tools/pdf-to-png" className="text-base font-bold text-slate-700 hover:text-primary transition-colors">
                      PDF to PNG
                    </Link>
                    <Link href="/tools/image-to-pdf" className="text-base font-bold text-slate-700 hover:text-primary transition-colors">
                      Image to PDF
                    </Link>
                  </div>
                </div>
                <Link href="/tools" className="text-lg font-bold text-slate-800 hover:text-primary transition-colors border-t border-slate-100 pt-6">
                  All Tools
                </Link>
                <Link href="#privacy" className="text-lg font-bold text-slate-800 hover:text-primary transition-colors">
                  Privacy
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
