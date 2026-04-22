import { AppShell } from "@/components/layout/app-shell";
import { RouteGuard } from "@/components/auth/route-guard";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <RouteGuard>
      <AppShell>
        <DashboardContent />
      </AppShell>
    </RouteGuard>
  );
}
