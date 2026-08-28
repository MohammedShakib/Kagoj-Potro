import { DashboardGrid } from "@/components/home/dashboard-grid";
import { ComingSoonTools } from "@/components/home/coming-soon-tools";
import { PrivacySection } from "@/components/home/privacy-section";
import { PlatformGrowth } from "@/components/home/platform-growth";

export default function Home() {
  return (
    <>
      <DashboardGrid />
      <ComingSoonTools />
      <PrivacySection />
      <PlatformGrowth />
    </>
  );
}
