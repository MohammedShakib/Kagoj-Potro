export function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Upload",
      description: "Choose or drop your PDF document.",
    },
    {
      step: "2",
      title: "Convert",
      description: "Kagoj Potro securely processes each page locally.",
    },
    {
      step: "3",
      title: "Download",
      description: "Get your high-quality JPG or ZIP package.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 py-24 border-t">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          How Kagoj Potro works
        </h2>
        <div className="relative mx-auto max-w-4xl">
          {/* Connecting line (desktop) */}
          <div className="absolute left-[15%] right-[15%] top-6 hidden h-[2px] bg-border sm:block"></div>
          
          <div className="grid gap-12 sm:grid-cols-3 sm:gap-8">
            {steps.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20 ring-8 ring-slate-50">
                  {s.step}
                </div>
                <h3 className="mb-3 text-xl font-semibold">{s.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
