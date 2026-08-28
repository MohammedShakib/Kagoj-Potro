import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { ToolConfig } from "@/types/tools";

interface ToolPageHeaderProps {
  tool: ToolConfig;
}

export function ToolPageHeader({ tool }: ToolPageHeaderProps) {
  return (
    <div className="mb-10 space-y-6 text-center">
      <nav className="flex items-center justify-center space-x-2 text-sm font-semibold text-slate-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Kagoj Potro
        </Link>
        <ChevronRight className="h-4 w-4 opacity-50" />
        <Link href="/tools" className="hover:text-primary transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4 opacity-50" />
        <span className="text-slate-800">{tool.name}</span>
      </nav>

      <div className="flex flex-col items-center justify-center space-y-5">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ring-slate-100 shadow-sm ${tool.colorAccent ? tool.colorAccent.replace('bg-', 'bg-').replace('/10', '/10').replace(' text-', ' text-') : "bg-primary/10 text-primary"}`}>
          <tool.icon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          {tool.name}
        </h1>
        <p className="max-w-[600px] text-lg text-slate-600 leading-relaxed">
          {tool.description}
        </p>
      </div>

      <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-green-700 shadow-sm">
        <ShieldCheck className="h-4 w-4" />
        Processed locally in your browser
      </div>
    </div>
  );
}
