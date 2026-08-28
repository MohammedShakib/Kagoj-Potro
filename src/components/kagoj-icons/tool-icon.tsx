import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { KagojIconProps } from "@/components/kagoj-icons";

type ToolIconSize = "sm" | "md" | "lg";

const sizeClasses: Record<ToolIconSize, string> = {
  sm: "h-10 w-10 rounded-[1rem] [&_svg]:h-[22px] [&_svg]:w-[22px]",
  md: "h-12 w-12 rounded-[1.1rem] [&_svg]:h-6 [&_svg]:w-6",
  lg: "h-14 w-14 rounded-[1.2rem] [&_svg]:h-7 [&_svg]:w-7",
};

interface ToolIconProps {
  icon: ComponentType<KagojIconProps>;
  toneClassName: string;
  className?: string;
  iconClassName?: string;
  size?: ToolIconSize;
}

export function ToolIcon({
  icon: Icon,
  toneClassName,
  className,
  iconClassName,
  size = "md",
}: ToolIconProps) {
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center ring-1 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-200",
        sizeClasses[size],
        toneClassName,
        className,
      )}
    >
      <Icon className={cn("shrink-0", iconClassName)} />
    </div>
  );
}
