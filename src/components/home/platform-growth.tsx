import { FileArchive, Wand2, Type, Grip } from "lucide-react";

export function PlatformGrowth() {
  return (
    <section className="px-4 py-16 md:py-32 bg-white">
      <div className="container mx-auto max-w-[1240px]">
        <div className="rounded-[2.5rem] bg-blue-50/50 p-8 md:p-16 border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl opacity-50" />
          
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                More document tools. <br />
                <span className="text-primary">One simple workspace.</span>
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Kagoj Potro is growing into a complete toolkit for everyday PDF and image tasks. We&apos;re actively building new features to help you work faster.
              </p>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <FileArchive className="h-4 w-4" />
                  </div>
                  Compress PDFs
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  Add watermarks
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Type className="h-4 w-4" />
                  </div>
                  Add page numbers
                </li>
                <li className="flex items-center gap-3 text-slate-700 font-semibold">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Grip className="h-4 w-4" />
                  </div>
                  Organize pages
                </li>
              </ul>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="flex flex-col gap-4 translate-y-8">
                  <div className="rounded-2xl border-4 border-white bg-blue-100 p-6 shadow-xl shadow-blue-900/5 aspect-square flex items-center justify-center text-blue-500 hover:scale-105 transition-transform duration-300">
                    <FileArchive className="h-16 w-16" />
                  </div>
                  <div className="rounded-2xl border-4 border-white bg-indigo-100 p-6 shadow-xl shadow-blue-900/5 aspect-square flex items-center justify-center text-indigo-500 hover:scale-105 transition-transform duration-300">
                    <Wand2 className="h-16 w-16" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border-4 border-white bg-teal-100 p-6 shadow-xl shadow-blue-900/5 aspect-square flex items-center justify-center text-teal-500 hover:scale-105 transition-transform duration-300">
                    <Type className="h-16 w-16" />
                  </div>
                  <div className="rounded-2xl border-4 border-white bg-violet-100 p-6 shadow-xl shadow-blue-900/5 aspect-square flex items-center justify-center text-violet-500 hover:scale-105 transition-transform duration-300">
                    <Grip className="h-16 w-16" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
