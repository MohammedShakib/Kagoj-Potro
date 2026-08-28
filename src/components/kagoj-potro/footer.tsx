import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="container mx-auto max-w-[1240px] px-4 py-10 md:py-12 lg:px-6">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <Link href="/" className="group flex items-center space-x-3">
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
              <p className="max-w-sm text-sm leading-6 text-slate-400">
                Simple tools for everyday documents.
              </p>
            </div>

            <nav className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-400">
              <Link href="/tools" className="transition-colors hover:text-blue-400">
                All Tools
              </Link>
              <Link href="/tools/pdf-to-jpg" className="transition-colors hover:text-blue-400">
                PDF to JPG
              </Link>
              <Link href="/tools/merge-pdf" className="transition-colors hover:text-blue-400">
                Merge PDF
              </Link>
              <Link href="#privacy" className="transition-colors hover:text-blue-400">
                Privacy
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium text-slate-500">
              &copy; {new Date().getFullYear()} Kagoj Potro. Processed locally in your browser.
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              No uploads to external servers
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
