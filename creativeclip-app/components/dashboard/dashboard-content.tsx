"use client";

import { useAppContext } from "@/components/providers/app-provider";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { Card } from "@/components/ui/card";
import { PlanCard } from "@/components/plans/plan-card";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "R$ 0",
    features: ["10 gerações/mês", "Histórico básico", "Suporte comunidade"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "R$ 79/mês",
    features: ["150 gerações/mês", "Uploads ilimitados", "Prioridade média"],
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 199/mês",
    features: ["Gerações ilimitadas", "Modelos premium", "Suporte prioritário"],
  },
] as const;

export function DashboardContent() {
  const { user, history } = useAppContext();

  return (
    <>
      <StatsGrid user={user} history={history} />
      <QuickActions />
      <Card className="space-y-2">
        <h2 className="text-lg font-semibold text-white">Resumo do projeto</h2>
        <p className="text-sm text-slate-300">
          O hub já está com autenticação base, geração mock e histórico funcional.
          Próximos passos: conectar buckets do Supabase Storage e API real do Replicate.
        </p>
      </Card>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Planos (simulação inicial)</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} currentPlan={user?.plan ?? "free"} />
          ))}
        </div>
      </section>
    </>
  );
}
