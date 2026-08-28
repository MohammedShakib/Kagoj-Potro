"use client";

import { useState } from "react";
import { TOOLS } from "@/config/tools";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolCategory } from "@/types/tools";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

export function DashboardGrid() {
  const [activeTab, setActiveTab] = useState<"All" | ToolCategory | "Images">("All");

  const filteredTools = TOOLS.filter((tool) => {
    if (activeTab === "All") return true;
    if (activeTab === "Images") return tool.id === "pdf-to-jpg" || tool.id === "pdf-to-png" || tool.id === "image-to-pdf";
    return tool.category === activeTab;
  });

  const tabs = ["All", "Convert", "Organize", "Images"] as const;

  return (
    <section className="relative z-10 bg-slate-50 px-4 pb-16 pt-3 md:pb-20" id="tools">
      <div className="container mx-auto max-w-[1240px]">
        <div className="mb-8 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 sm:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-9 rounded-full border px-4 text-sm font-semibold transition-all duration-200 select-none ${
                  activeTab === tab
                    ? "border-primary bg-primary text-white shadow-[0_8px_20px_rgba(37,99,235,0.18)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.slug}
              className="group relative flex min-h-[168px] flex-col rounded-[1.05rem] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:p-6"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <ToolIcon
                  icon={tool.icon}
                  iconSrc={tool.iconSrc}
                  iconAlt={tool.iconAlt ?? tool.name}
                  toneClassName={tool.iconToneClassName}
                  imageClassName={tool.iconImageClassName}
                  size="lg"
                  className="group-hover:scale-[1.03]"
                />
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  {tool.badge ?? tool.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mb-2 text-[17px] font-semibold tracking-tight text-slate-900 transition-colors group-hover:text-blue-700">
                  {tool.name}
                </h3>
                <p className="max-w-[28ch] text-sm leading-6 text-slate-600">
                  {tool.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-blue-50 group-hover:text-blue-600">
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
