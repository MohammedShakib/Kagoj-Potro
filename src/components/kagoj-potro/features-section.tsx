import { ShieldCheck, Image, Zap, CheckCircle2 } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      title: "Private by Design",
      description: "Your files are processed directly in your browser. Nothing is uploaded to any server.",
      icon: ShieldCheck,
    },
    {
      title: "High Quality",
      description: "PDF pages are rendered at high resolution before JPG export.",
      icon: Image,
    },
    {
      title: "Fast Downloads",
      description: "Single pages download directly; multi-page PDFs are automatically packaged.",
      icon: Zap,
    },
    {
      title: "No Signup",
      description: "Use the converter immediately without any accounts or tracking.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
