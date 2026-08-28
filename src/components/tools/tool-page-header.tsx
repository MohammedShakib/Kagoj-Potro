import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { ToolConfig } from "@/types/tools";

interface ToolPageHeaderProps {
  tool: ToolConfig;
}

export function ToolPageHeader({ tool }: ToolPageHeaderProps) {
  return (
    <div className="mb-8 space-y-6 text-center">
      <nav className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Kagoj Potro
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/tools" className="hover:text-foreground transition-colors">
          Tools
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-foreground">{tool.name}</span>
      </nav>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tool.colorAccent || "bg-primary/10 text-primary"}`}>
          <tool.icon className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          {tool.name}
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          {tool.description}
        </p>
      </div>

      <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-medium text-green-700">
        <ShieldCheck className="h-4 w-4" />
        Processed locally in your browser
      </div>
    </div>
  );
}
