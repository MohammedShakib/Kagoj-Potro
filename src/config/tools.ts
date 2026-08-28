import {
  Image,
  Images,
  FileImage,
  Combine,
  Scissors,
  RotateCw,
} from "lucide-react";
import { ToolConfig } from "@/types/tools";

export const TOOLS: ToolConfig[] = [
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG",
    slug: "/tools/pdf-to-jpg",
    description: "Turn every PDF page into a high-quality JPG image.",
    icon: Image,
    category: "Convert",
    enabled: true,
    colorAccent: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    slug: "/tools/pdf-to-png",
    description: "Convert PDF pages to PNG images with transparent backgrounds.",
    icon: Images,
    category: "Convert",
    enabled: true,
    colorAccent: "text-cyan-500 bg-cyan-500/10",
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    slug: "/tools/image-to-pdf",
    description: "Convert JPG and PNG images into a single PDF document.",
    icon: FileImage,
    category: "Convert",
    enabled: true,
    colorAccent: "text-indigo-500 bg-indigo-500/10",
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    slug: "/tools/merge-pdf",
    description: "Combine multiple PDFs into a single document.",
    icon: Combine,
    category: "Organize",
    enabled: true,
    colorAccent: "text-violet-500 bg-violet-500/10",
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    slug: "/tools/split-pdf",
    description: "Extract pages from your PDF or split each page into a separate PDF.",
    icon: Scissors,
    category: "Organize",
    enabled: true,
    colorAccent: "text-blue-600 bg-blue-600/10",
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    slug: "/tools/rotate-pdf",
    description: "Rotate your PDF pages 90 or 180 degrees.",
    icon: RotateCw,
    category: "Organize",
    enabled: true,
    colorAccent: "text-teal-500 bg-teal-500/10",
  },
];

export const POPULAR_TOOLS = ["pdf-to-jpg", "image-to-pdf", "merge-pdf", "split-pdf"];

export const FUTURE_TOOLS: Partial<ToolConfig>[] = [
  {
    name: "Compress PDF",
    category: "Optimize",
  },
  {
    name: "Watermark PDF",
    category: "Edit",
  },
  {
    name: "Page Numbers",
    category: "Organize",
  },
  {
    name: "Protect PDF",
    category: "Edit",
  }
];
