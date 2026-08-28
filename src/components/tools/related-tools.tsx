import { TOOLS } from "@/config/tools";
import Link from "next/link";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function RelatedTools({ currentToolId }: { currentToolId: string }) {
  const currentTool = TOOLS.find((t) => t.id === currentToolId);
  
  // Find related tools: same category, up to 3 tools
  let related = TOOLS.filter((t) => t.category === currentTool?.category && t.id !== currentToolId);
  
  if (related.length === 0) {
    related = TOOLS.filter((t) => t.id !== currentToolId);
  }
  
  // Limit to 3 tools
  related = related.slice(0, 3);

  return (
    <div className="mx-auto w-full max-w-4xl pt-16">
      <h3 className="mb-6 text-xl font-semibold text-slate-800">Related Tools</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((tool) => (
          <Link
            key={tool.id}
            href={tool.slug}
            className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <ToolIcon
                icon={tool.icon}
                iconSrc={tool.iconSrc}
                iconAlt={tool.iconAlt ?? tool.name}
                toneClassName={tool.iconToneClassName}
                size="md"
              />
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {tool.badge ?? tool.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col">
              <h4 className="mb-1 text-sm font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
                {tool.name}
              </h4>
              <p className="text-xs leading-5 text-slate-600 line-clamp-2">
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
