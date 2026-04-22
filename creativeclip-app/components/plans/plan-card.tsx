"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PlanTier } from "@/types";

type PlanCardProps = {
  plan: {
    id: PlanTier;
    name: string;
    price: string;
    features: readonly string[];
    highlighted?: boolean;
  };
  currentPlan: PlanTier;
};

export function PlanCard({ plan, currentPlan }: PlanCardProps) {
  const isCurrent = currentPlan === plan.id;
  return (
    <Card
      className={cn(
        "space-y-4",
        plan.highlighted
          ? "border-violet-300/40 bg-violet-900/20"
          : "border-white/10 bg-slate-950/50",
      )}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          {plan.highlighted ? (
            <Badge className="border-violet-300/40 bg-violet-500/20 text-violet-100">
              Mais popular
            </Badge>
          ) : null}
        </div>
        <p className="text-2xl font-semibold text-white">{plan.price}</p>
      </div>
      <ul className="space-y-2 text-sm text-slate-300">
        {plan.features.map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <Button variant={isCurrent ? "secondary" : "primary"} className="w-full">
        {isCurrent ? "Plano atual" : "Selecionar (mock)"}
      </Button>
    </Card>
  );
}
