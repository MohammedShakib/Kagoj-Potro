import Link from "next/link";
import { FileImage } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-50 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-12 sm:grid-cols-3 md:grid-cols-4 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <FileImage className="h-6 w-6 text-primary" />
              <span className="text-xl font-black tracking-tight text-foreground">Kagoj Potro</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Simple, powerful, and 100% private document tools. Your files never leave your device.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6">Tools</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors font-medium text-primary">PDF to JPG</Link>
              </li>
              <li>
                <span className="opacity-50 cursor-not-allowed">JPG to PDF</span>
              </li>
              <li>
                <span className="opacity-50 cursor-not-allowed">Merge PDF</span>
              </li>
              <li>
                <span className="opacity-50 cursor-not-allowed">Compress PDF</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <Link href="#privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#about" className="hover:text-foreground transition-colors">About Us</Link>
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
