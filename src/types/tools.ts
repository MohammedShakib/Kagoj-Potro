import { LucideIcon } from "lucide-react";

export type ToolCategory = "Convert" | "Organize" | "Edit" | "Optimize";

export interface ToolConfig {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: LucideIcon;
  category: ToolCategory;
  enabled: boolean;
  colorAccent?: string;
  badge?: string;
}
