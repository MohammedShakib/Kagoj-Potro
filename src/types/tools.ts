import type { ComponentType } from "react";
import type { KagojIconProps } from "@/components/kagoj-icons";

export type ToolCategory = "Convert" | "Organize" | "Edit" | "Optimize";

export interface ToolConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: ComponentType<KagojIconProps>;
  category: ToolCategory;
  enabled: boolean;
  iconToneClassName: string;
  badge?: string;
}

export interface FutureToolConfig {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: ComponentType<KagojIconProps>;
  iconToneClassName: string;
}
