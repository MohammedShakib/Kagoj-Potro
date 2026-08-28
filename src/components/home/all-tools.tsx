import { TOOLS } from "@/config/tools";
import { ToolConfig } from "@/types/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

const ToolGrid = ({ tools }: { tools: ToolConfig[] }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {tools.map((tool) => (
      <Link
        key={tool.id}
        href={tool.slug}
        className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
      >
        <div className="flex items-start justify-between">
          <ToolIcon icon={tool.icon} toneClassName={tool.iconToneClassName} />
          <ArrowRight className="h-5 w-5 text-slate-300 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <div>
          <h3 className="mb-2 font-bold text-slate-900 group-hover:text-primary transition-colors text-lg">
            {tool.name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {tool.description}
          </p>
        </div>
      </Link>
    ))}
  </div>
);

export function AllTools() {
  const convertTools = TOOLS.filter((t) => t.category === "Convert");
  const organizeTools = TOOLS.filter((t) => t.category === "Organize");

  return (
    <section className="px-4 py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto max-w-[1200px]">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">All tools</h2>
          <p className="text-lg text-slate-600 leading-relaxed">Everything you need for quick document tasks. Fast, simple, and browser-first.</p>
        </div>

        <div className="space-y-16">
          <div>
            <h3 className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-900">
              Convert
              <div className="h-px flex-1 bg-slate-200"></div>
            </h3>
            <ToolGrid tools={convertTools} />
          </div>
          
          <div>
            <h3 className="mb-6 flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-900">
              Organize
              <div className="h-px flex-1 bg-slate-200"></div>
            </h3>
            <ToolGrid tools={organizeTools} />
          </div>
        </div>
      </div>
    </section>
  );
}
