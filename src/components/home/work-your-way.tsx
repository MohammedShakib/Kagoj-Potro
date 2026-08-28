import { FastIcon, PrivateIcon, SimpleIcon } from "@/components/kagoj-icons";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function WorkYourWay() {
  const items = [
    {
      title: "Fast",
      description: "Quick document tasks without waiting for uploads or external processing queues.",
      icon: FastIcon,
      tone: "bg-blue-50 text-blue-600 ring-blue-100",
    },
    {
      title: "Private",
      description: "Files stay inside your browser for supported local tools, from start to finish.",
      icon: PrivateIcon,
      tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    },
    {
      title: "Simple",
      description: "A focused workflow with no account wall, no clutter, and no unnecessary setup.",
      icon: SimpleIcon,
      tone: "bg-indigo-50 text-indigo-600 ring-indigo-100",
    },
  ];

  return (
    <section className="border-t border-slate-100 bg-slate-50 px-4 py-16 md:py-20">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">Work your way</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Kagoj Potro is built to respect your time and your data.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.35rem] border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <ToolIcon
                icon={item.icon}
                toneClassName={item.tone}
                size="lg"
                className="mx-auto mb-5"
              />
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mx-auto max-w-xs text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
