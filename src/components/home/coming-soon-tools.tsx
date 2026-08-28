import { Lock, FileMinus, Grip, FileArchive, Wand2, Type } from "lucide-react";

export function ComingSoonTools() {
  const futureTools = [
    { name: "Compress PDF", icon: FileArchive, category: "Optimize" },
    { name: "Watermark PDF", icon: Wand2, category: "Edit" },
    { name: "Page Numbers", icon: Type, category: "Organize" },
    { name: "Organize PDF", icon: Grip, category: "Organize" },
    { name: "Extract Pages", icon: FileMinus, category: "Organize" },
    { name: "Protect PDF", icon: Lock, category: "Edit" },
  ];

  return (
    <section className="px-4 py-16 bg-white border-t border-slate-100">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">More tools are coming</h2>
          <p className="text-sm font-medium text-slate-500">We are expanding Kagoj Potro into a complete document toolkit.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 opacity-60">
          {futureTools.map((tool, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm select-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-500">
                <tool.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-1 leading-tight">
                  {tool.name}
                </h3>
                <span className="inline-block rounded bg-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-600">
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
