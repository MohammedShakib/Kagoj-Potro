import { ShieldCheck, Image, Zap, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Private by Design",
      description: "Files are processed in your browser. Nothing is uploaded to any server.",
      icon: ShieldCheck,
    },
    {
      title: "High Quality JPGs",
      description: "Each PDF page is rendered at high resolution for crystal-clear results.",
      icon: Image,
    },
    {
      title: "Fast Conversion",
      description: "Convert instantly using your device's processing power, no waiting in line.",
      icon: Zap,
    },
    {
      title: "No Signup Required",
      description: "Start using the converter immediately without accounts or tracking.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
          <p className="mt-4 text-lg text-muted-foreground">Simple, fast, and completely secure.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
