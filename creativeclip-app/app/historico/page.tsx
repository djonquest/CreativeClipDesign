import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/layout/app-shell";
import { HistoryContent } from "@/components/history/history-content";

export default function HistoricoPage() {
  return (
    <RouteGuard>
      <AppShell>
        <HistoryContent />
      </AppShell>
    </RouteGuard>
  );
}
