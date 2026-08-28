"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/kagoj-potro/footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  if (pathname === "/tools" || pathname.startsWith("/tools/")) {
    return null;
  }

  return <Footer />;
}
