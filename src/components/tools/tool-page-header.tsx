import { ToolConfig } from "@/types/tools";
import { ToolIcon } from "@/components/kagoj-icons/tool-icon";

interface ToolPageHeaderProps {
  tool: ToolConfig;
}

export function ToolPageHeader({ tool }: ToolPageHeaderProps) {
  return (
    <div className="mb-8 text-center sm:mb-10">
      <div className="flex flex-col items-center justify-center gap-4">
        <ToolIcon
          icon={tool.icon}
          iconSrc={tool.iconSrc}
          iconAlt={tool.iconAlt ?? tool.name}
          toneClassName={tool.iconToneClassName}
          imageClassName={tool.iconImageClassName}
          size="lg"
        />
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.8rem] lg:leading-[1.05]">
          {tool.name}
        </h1>
        <p className="text-base text-slate-600 sm:text-lg">{tool.description}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          <svg className="h-3.5 w-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Processed locally in your browser
        </div>
      </div>
    </div>
  );
}
