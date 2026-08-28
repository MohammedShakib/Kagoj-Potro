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
      </div>
    </div>
  );
}
