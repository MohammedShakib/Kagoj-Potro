import { TOOLS, POPULAR_TOOLS } from "@/config/tools";
import { ToolConfig } from "@/types/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function PopularTools() {
  const popularToolsConfig = POPULAR_TOOLS.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolConfig[];

  return (
    <section className="px-4 py-16 md:py-24 bg-white">
      <div className="container mx-auto max-w-[1200px]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularToolsConfig.map((tool) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <ToolIcon icon={tool.icon} toneClassName={tool.iconToneClassName} size="lg" />
              <div>
                <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <div className="mt-auto pt-4 flex justify-end">
                <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
