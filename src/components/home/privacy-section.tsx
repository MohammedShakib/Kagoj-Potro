import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function PrivacySection() {
  const items = [
    {
      title: "Local Processing",
      description: "Calculations happen directly on your device.",
      iconSrc: "/Icons/browser-processing.png",
      iconAlt: "Local processing icon",
    },
    {
      title: "No Document Storage",
      description: "Your documents are not stored by Kagoj Potro.",
      iconSrc: "/Icons/no-document-storage.png",
      iconAlt: "No document storage icon",
    },
    {
      title: "No Account Required",
      description: "Use the tools immediately without signup.",
      iconSrc: "/Icons/no-signup-required.png",
      iconAlt: "No account required icon",
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
                iconSrc={item.iconSrc}
                iconAlt={item.iconAlt}
                toneClassName="bg-transparent ring-0 shadow-none"
                imageClassName="scale-[1.24]"
                size="xl"
                className="mx-auto mb-5 h-16 w-16 rounded-none"
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
