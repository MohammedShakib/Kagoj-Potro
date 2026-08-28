export function FutureToolsCTA() {
  return (
    <section className="px-4 py-16 bg-muted/20 border-t border-b">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl mb-4">
          More tools are coming.
        </h2>
        <p className="text-lg text-muted-foreground mx-auto max-w-2xl">
          Kagoj Potro is growing into a complete everyday document toolkit. We are actively building advanced PDF optimization, OCR, and editing tools for future phases.
        </p>
        
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <div className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-muted-foreground opacity-60">
            Compress PDF <span className="ml-1 text-xs uppercase text-primary">Later</span>
          </div>
          <div className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-muted-foreground opacity-60">
            Watermark <span className="ml-1 text-xs uppercase text-primary">Later</span>
          </div>
          <div className="rounded-full border bg-white px-4 py-2 text-sm font-medium text-muted-foreground opacity-60">
            Page Numbers <span className="ml-1 text-xs uppercase text-primary">Later</span>
          </div>
        </div>
      </div>
    </section>
  );
}
