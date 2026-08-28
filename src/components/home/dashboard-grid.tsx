"use client";

import { useState } from "react";
import { TOOLS } from "@/config/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolCategory } from "@/types/tools";

export function DashboardGrid() {
  const [activeTab, setActiveTab] = useState<"All" | ToolCategory | "Images">("All");

  const filteredTools = TOOLS.filter((tool) => {
    if (activeTab === "All") return true;
    if (activeTab === "Images") return tool.id === "pdf-to-jpg" || tool.id === "pdf-to-png" || tool.id === "image-to-pdf";
    return tool.category === activeTab;
  });

  const tabs = ["All", "Convert", "Organize", "Images"] as const;

  return (
    <section className="px-4 pb-16 md:pb-24 pt-4 bg-slate-50 relative z-10">
      <div className="container mx-auto max-w-[1240px]">
        
        {/* CATEGORY FILTER PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 select-none ${
                activeTab === tab
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TOOL GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 min-h-[170px]"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${tool.colorAccent || "bg-primary/10 text-primary"}`}>
                  <tool.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="mb-2 text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 pr-6">
                  {tool.description}
                </p>
              </div>
              <div className="absolute bottom-6 right-6 flex items-center justify-center">
                <ArrowRight className="h-5 w-5 text-slate-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
