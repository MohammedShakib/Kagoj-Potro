import type { ComponentType } from "react";
import type { KagojIconProps } from "@/components/kagoj-icons";

export type ToolCategory = "Convert" | "Organize" | "Edit" | "Optimize";

interface ToolGraphic {
  icon?: ComponentType<KagojIconProps>;
  iconSrc?: string;
  iconAlt?: string;
  iconToneClassName?: string;
  iconImageClassName?: string;
}

export interface ToolConfig extends ToolGraphic {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  enabled: boolean;
  badge?: string;
}

export interface FutureToolConfig extends ToolGraphic {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
}
