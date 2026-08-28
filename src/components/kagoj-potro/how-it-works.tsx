import { UploadCloud, Zap, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      title: "Upload",
      description: "Choose or drop your document.",
      icon: UploadCloud,
    },
    {
      title: "Convert",
      description: "Kagoj Potro processes the file locally.",
      icon: Zap,
    },
    {
      title: "Download",
      description: "Save your result instantly.",
      icon: Download,
    },
  ];

  return (
    <section className="px-4 py-16 md:py-24 bg-white" id="how-it-works">
      <div className="container mx-auto max-w-[1200px]">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-4">How it works</h2>
          <p className="text-lg text-slate-600 leading-relaxed">It&apos;s as simple as 1-2-3. No complex menus, no waiting for uploads.</p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Connector line (desktop only) */}
          <div className="absolute top-10 left-[15%] right-[15%] hidden h-[2px] bg-slate-100 md:block" />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  Step {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed max-w-[250px] mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
