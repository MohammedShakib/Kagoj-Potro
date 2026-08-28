import { FUTURE_TOOLS } from "@/config/tools";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function PlatformGrowth() {
  const showcaseTools = FUTURE_TOOLS.slice(0, 4);

  return (
    <section className="bg-white px-4 py-16 md:py-20">
      <div className="container mx-auto max-w-[1240px]">
        <div className="relative overflow-hidden rounded-[2rem] border border-blue-100 bg-blue-50/60 p-8 md:p-12">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" />
          
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl lg:leading-[1.05]">
                More document tools. <br />
                <span className="text-primary">One simple workspace.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Kagoj Potro is growing into a complete toolkit for everyday PDF and image tasks. We&apos;re actively building new features to help you work faster.
              </p>
              
              <ul className="space-y-3 pt-2">
                {showcaseTools.map((tool) => (
                  <li key={tool.id} className="flex items-center gap-3 text-slate-700">
                    <ToolIcon icon={tool.icon} toneClassName={tool.iconToneClassName} size="sm" />
                    <span className="font-semibold">{tool.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/70 p-5 shadow-[0_24px_50px_rgba(37,99,235,0.08)] backdrop-blur">
                <div className="grid grid-cols-2 gap-4">
                  {showcaseTools.map((tool, index) => (
                    <div
                      key={tool.id}
                      className={`rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-sm ${
                        index % 2 === 0 ? "translate-y-4" : ""
                      }`}
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <ToolIcon icon={tool.icon} toneClassName={tool.iconToneClassName} size="lg" />
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-slate-200" />
                          <span className="h-2 w-2 rounded-full bg-slate-200" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-16 rounded-full bg-slate-200" />
                        <div className="h-2 w-12 rounded-full bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-10 top-1/2 hidden h-px -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(59,130,246,0.22),transparent)] lg:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
