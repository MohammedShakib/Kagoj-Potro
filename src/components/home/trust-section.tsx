import { LocalProcessingIcon, NoAccountIcon, NoStorageIcon } from "@/components/kagoj-icons";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function TrustSection() {
  const items = [
    {
      title: "Browser Processing",
      icon: LocalProcessingIcon,
      tone: "bg-blue-50 text-blue-600 ring-blue-100",
    },
    {
      title: "No Document Storage",
      icon: NoStorageIcon,
      tone: "bg-teal-50 text-teal-700 ring-teal-100",
    },
    {
      title: "No Signup Required",
      icon: NoAccountIcon,
      tone: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    },
  ];

  return (
    <section className="border-t border-slate-100 bg-white px-4 py-14 md:py-16">
      <div className="container mx-auto max-w-[1240px] text-center">
        <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Document tools built around privacy.
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-600">
          Kagoj Potro gives you simple PDF and image utilities while keeping supported Phase 1 processing inside your browser.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-left"
            >
              <ToolIcon icon={item.icon} toneClassName={item.tone} size="sm" />
              <span className="text-sm font-semibold text-slate-800">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
