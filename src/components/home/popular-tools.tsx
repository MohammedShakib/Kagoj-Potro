import { TOOLS, POPULAR_TOOLS } from "@/config/tools";
import { ToolConfig } from "@/types/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PopularTools() {
  const popularToolsConfig = POPULAR_TOOLS.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolConfig[];

  return (
    <section className="px-4 py-12 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularToolsConfig.map((tool) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.colorAccent || "bg-primary/10 text-primary"}`}>
                <tool.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tool.description}
                </p>
              </div>
              <div className="mt-auto pt-2 flex justify-end">
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
