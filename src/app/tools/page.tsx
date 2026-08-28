import { DashboardGrid } from "@/components/home/dashboard-grid";
import { Suspense } from "react";

export default function ToolsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="pt-12 pb-6 text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
          All Tools
        </h1>
        <p className="text-base sm:text-lg text-slate-600">
          Every document and image tool in one place.
        </p>
      </div>
      
      <Suspense fallback={<div className="h-96" />}>
        <DashboardGrid />
      </Suspense>
    </div>
  );
}
