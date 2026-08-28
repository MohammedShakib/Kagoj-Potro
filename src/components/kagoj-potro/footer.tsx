import Link from "next/link";
import { TOOLS } from "@/config/tools";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="container mx-auto max-w-[1240px] px-4 py-14 md:py-16 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(3,0.8fr)]">
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/kagoj-potro-icon-transparent.png"
                alt="Kagoj Potro"
                width={913}
                height={861}
                className="h-10 w-auto transition-transform duration-200 group-hover:scale-[1.03]"
              />
              <span className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
                Kagoj Potro
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-slate-400">
              Simple tools for everyday documents.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tools</h4>
            <ul className="space-y-4 text-sm font-medium">
              {TOOLS.map(tool => (
                <li key={tool.id}>
                  <Link href={tool.slug} className="text-slate-400 transition-colors hover:text-blue-400">{tool.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/tools?category=convert" className="text-slate-400 transition-colors hover:text-blue-400">Convert</Link>
              </li>
              <li>
                <Link href="/tools?category=organize" className="text-slate-400 transition-colors hover:text-blue-400">Organize</Link>
              </li>
              <li>
                <Link href="/tools" className="text-slate-400 transition-colors hover:text-blue-400">All Tools</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Info</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="#privacy" className="text-slate-400 transition-colors hover:text-blue-400">Privacy</Link>
              </li>
              <li>
                <Link href="/tools/pdf-to-jpg" className="text-slate-400 transition-colors hover:text-blue-400">Start with PDF to JPG</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} Kagoj Potro. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400"></div>
            Processed locally in your browser
          </div>
        </div>
      </div>
    </footer>
  );
}
