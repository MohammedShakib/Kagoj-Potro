import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function TrustSection() {
  const items = [
    {
      title: "Browser Processing",
      iconSrc: "/Icons/browser-processing.png",
      iconAlt: "Browser processing icon",
    },
    {
      title: "No Document Storage",
      iconSrc: "/Icons/no-document-storage.png",
      iconAlt: "No document storage icon",
    },
    {
      title: "No Signup Required",
      iconSrc: "/Icons/no-signup-required.png",
      iconAlt: "No signup required icon",
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
              <ToolIcon
                iconSrc={item.iconSrc}
                iconAlt={item.iconAlt}
                toneClassName="bg-transparent ring-0 shadow-none"
                imageClassName="scale-[1.22]"
                className="h-12 w-12 rounded-none"
                size="md"
              />
              <span className="text-sm font-semibold text-slate-800">{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
