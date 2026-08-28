import { TOOLS } from "@/config/tools";
import { ToolConfig } from "@/types/tools";
import Link from "next/link";

const ToolGrid = ({ tools }: { tools: ToolConfig[] }) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {tools.map((tool) => (
      <Link
        key={tool.id}
        href={tool.slug}
        className="group flex items-center gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
      >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${tool.colorAccent || "bg-primary/10 text-primary"}`}>
          <tool.icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
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
    <section className="px-4 py-16 bg-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">All tools</h2>
          <p className="mt-2 text-muted-foreground">Everything you need for quick document tasks.</p>
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Convert
            </h3>
            <ToolGrid tools={convertTools} />
          </div>
          
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Organize
            </h3>
            <ToolGrid tools={organizeTools} />
          </div>
        </div>
      </div>
    </section>
  );
}
