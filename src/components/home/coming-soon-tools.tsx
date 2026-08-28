import { FUTURE_TOOLS } from "@/config/tools";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function ComingSoonTools() {
  return (
    <section className="border-t border-slate-100 bg-white px-4 py-16 md:py-20">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">More tools are coming</h2>
          <p className="mx-auto max-w-2xl text-sm font-medium leading-6 text-slate-600 sm:text-base">
            We&apos;re expanding Kagoj Potro into a complete document toolkit.
          </p>
        </div>

        <div className="grid gap-4 min-[390px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {FUTURE_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <ToolIcon
                  icon={tool.icon}
                  iconSrc={tool.iconSrc}
                  iconAlt={tool.iconAlt ?? tool.name}
                  toneClassName={tool.iconToneClassName}
                  imageClassName={tool.iconImageClassName}
                  size="sm"
                />
                <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Coming Soon
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold leading-tight text-slate-800">
                  {tool.name}
                </h3>
                <p className="text-xs leading-5 text-slate-600">
                  {tool.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
