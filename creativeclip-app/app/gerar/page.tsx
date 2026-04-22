import { RouteGuard } from "@/components/auth/route-guard";
import { AppShell } from "@/components/layout/app-shell";
import { GenerationForm } from "@/components/generator/generation-form";

export default function GerarPage() {
  return (
    <RouteGuard>
      <AppShell>
        <GenerationForm />
      </AppShell>
    </RouteGuard>
  );
}
