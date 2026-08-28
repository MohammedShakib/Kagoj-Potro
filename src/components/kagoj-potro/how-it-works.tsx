export function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Upload",
      description: "Choose or drop your PDF.",
    },
    {
      step: "2",
      title: "Convert",
      description: "Kagoj Potro processes each page locally.",
    },
    {
      step: "3",
      title: "Download",
      description: "Download your JPG or ZIP package.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-10 text-3xl font-bold tracking-tight">How it works</h2>
        <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                {s.step}
              </div>
              <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
              <p className="text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
