import { LocalProcessingIcon, NoAccountIcon, NoStorageIcon } from "@/components/kagoj-icons";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function PrivacySection() {
  const items = [
    {
      title: "Local Processing",
      description: "Calculations happen directly on your device.",
      icon: LocalProcessingIcon,
      tone: "bg-blue-500 text-white ring-blue-200",
    },
    {
      title: "No Document Storage",
      description: "Your documents are not stored by Kagoj Potro.",
      icon: NoStorageIcon,
      tone: "bg-teal-500 text-white ring-teal-200",
    },
    {
      title: "No Account Required",
      description: "Use the tools immediately without signup.",
      icon: NoAccountIcon,
      tone: "bg-indigo-500 text-white ring-indigo-200",
    },
  ];

  return (
    <section className="bg-white px-4 py-16 md:py-20" id="privacy">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
            Your documents stay on your device.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Kagoj Potro processes supported files directly inside your browser.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.35rem] border border-slate-200 bg-slate-50/70 p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            >
              <ToolIcon
                icon={item.icon}
                toneClassName={item.tone}
                size="lg"
                className="mx-auto mb-5"
              />
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-slate-900">{item.title}</h3>
              <p className="mx-auto max-w-xs text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
