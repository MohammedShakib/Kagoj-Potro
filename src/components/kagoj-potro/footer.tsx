import Link from "next/link";
import { TOOLS } from "@/config/tools";
import Image from "next/image";

export function Footer() {
  const convertTools = TOOLS.filter((t) => t.category === "Convert");
  const organizeTools = TOOLS.filter((t) => t.category === "Organize");

  return (
    <footer className="border-t bg-slate-900 text-slate-300">
      <div className="container mx-auto max-w-[1200px] px-4 py-16 md:py-20 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-6 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/kagoj-potro-icon-transparent.png"
                alt="Kagoj Potro"
                width={913}
                height={861}
                className="h-10 w-auto brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100"
              />
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                Kagoj Potro
              </span>
            </Link>
            <p className="text-base text-slate-400 max-w-sm leading-relaxed">
              Simple tools for everyday documents.
              <br />Fast, private, and 100% browser-based.
            </p>
          </div>

          {/* Tools Column */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tools</h4>
            <ul className="space-y-4 text-sm font-medium">
              {convertTools.map(tool => (
                <li key={tool.id}>
                  <Link href={tool.slug} className="text-slate-400 hover:text-white transition-colors">{tool.name}</Link>
                </li>
              ))}
              {organizeTools.map(tool => (
                <li key={tool.id}>
                  <Link href={tool.slug} className="text-slate-400 hover:text-white transition-colors">{tool.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Info</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/tools" className="text-slate-400 hover:text-white transition-colors">All Tools</Link>
              </li>
              <li>
                <Link href="#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 flex flex-col items-center justify-between border-t border-slate-800 pt-8 sm:flex-row gap-4">
          <p className="text-sm font-medium text-slate-500">
            &copy; {new Date().getFullYear()} Kagoj Potro. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <div className="h-2 w-2 rounded-full bg-green-500/80"></div>
            Processed locally in your browser
          </div>
        </div>
      </div>
    </footer>
  );
}
