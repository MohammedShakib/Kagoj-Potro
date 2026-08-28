import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { KagojIconProps } from "@/components/kagoj-icons";

type ToolIconSize = "sm" | "md" | "lg";

const sizeClasses: Record<ToolIconSize, string> = {
  sm: "h-10 w-10 rounded-xl [&_svg]:h-5 [&_svg]:w-5",
  md: "h-11 w-11 rounded-xl [&_svg]:h-[22px] [&_svg]:w-[22px]",
  lg: "h-12 w-12 rounded-2xl [&_svg]:h-6 [&_svg]:w-6",
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
        "inline-flex shrink-0 items-center justify-center ring-1 ring-inset transition-all duration-200",
        sizeClasses[size],
        toneClassName,
        className,
      )}
    >
      <Icon className={cn("shrink-0", iconClassName)} />
    </div>
  );
}
