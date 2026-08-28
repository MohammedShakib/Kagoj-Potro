import Link from "next/link";
import { TOOLS } from "@/config/tools";

export function Footer() {
  const convertTools = TOOLS.filter((t) => t.category === "Convert");
  const organizeTools = TOOLS.filter((t) => t.category === "Organize");

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Kagoj Potro
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Simple tools for everyday documents.
            </p>
          </div>

          {/* Tools Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Tools</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {convertTools.map(tool => (
                <li key={tool.id}>
                  <Link href={tool.slug} className="hover:text-primary transition-colors">{tool.name}</Link>
                </li>
              ))}
              {organizeTools.map(tool => (
                <li key={tool.id}>
                  <Link href={tool.slug} className="hover:text-primary transition-colors">{tool.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Info</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/tools" className="hover:text-primary transition-colors">All Tools</Link>
              </li>
              <li>
                <Link href="#privacy" className="hover:text-primary transition-colors">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/70">
          <p>© {new Date().getFullYear()} Kagoj Potro. All rights reserved.</p>
          <p>Processed locally in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
