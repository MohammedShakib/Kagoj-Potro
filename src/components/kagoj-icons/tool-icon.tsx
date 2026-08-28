import type { ComponentType } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { KagojIconProps } from "@/components/kagoj-icons";

type ToolIconSize = "sm" | "md" | "lg";

const sizeClasses: Record<ToolIconSize, string> = {
  sm: "h-10 w-10 rounded-[1rem]",
  md: "h-12 w-12 rounded-[1.1rem]",
  lg: "h-14 w-14 rounded-[1.2rem]",
};

const svgSizeClasses: Record<ToolIconSize, string> = {
  sm: "h-[22px] w-[22px]",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

interface ToolIconProps {
  icon?: ComponentType<KagojIconProps>;
  iconSrc?: string;
  iconAlt?: string;
  toneClassName?: string;
  className?: string;
  iconClassName?: string;
  imageClassName?: string;
  size?: ToolIconSize;
}

export function ToolIcon({
  icon: Icon,
  iconSrc,
  iconAlt,
  toneClassName,
  className,
  iconClassName,
  imageClassName,
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
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={iconAlt ?? ""}
          width={128}
          height={128}
          className={cn("h-full w-full scale-[1.14] object-contain", imageClassName)}
        />
      ) : Icon ? (
        <Icon className={cn("shrink-0", svgSizeClasses[size], iconClassName)} />
      ) : null}
    </div>
  );
}
