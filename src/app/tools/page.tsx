import { TOOLS } from "@/config/tools";
import { ToolConfig } from "@/types/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const ToolCard = ({ tool }: { tool: ToolConfig }) => (
  <Link href={tool.slug} className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 bg-white">
    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tool.colorAccent || "bg-primary/10 text-primary"}`}>
      <tool.icon className="h-6 w-6" />
    </div>
    <div>
      <h3 className="mb-2 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {tool.description}
      </p>
    </div>
    <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
      Open Tool <ArrowRight className="ml-1 h-4 w-4" />
    </div>
  </Link>
);

export default function ToolsPage() {
  const convertTools = TOOLS.filter((t) => t.category === "Convert");
  const organizeTools = TOOLS.filter((t) => t.category === "Organize");

  return (
    <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mb-4">
          All Kagoj Potro Tools
        </h1>
        <p className="text-lg text-muted-foreground">
          Simple tools for PDF and image tasks.
        </p>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-2">
            Convert
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {convertTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold tracking-tight mb-8 flex items-center gap-2">
            Organize
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {organizeTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
