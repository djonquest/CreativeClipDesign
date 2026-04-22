"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { AppUser, CreationRecord } from "@/types";

type StatsGridProps = {
  user: AppUser | null;
  history: CreationRecord[];
};

const REFERENCE_TIMESTAMP = Date.now();

export function StatsGrid({ user, history }: StatsGridProps) {
  const oneWeekMs = 1000 * 60 * 60 * 24 * 7;
  const creationsThisWeek = history.filter((item) => {
    return REFERENCE_TIMESTAMP - new Date(item.createdAt).getTime() <= oneWeekMs;
  }).length;

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card className="space-y-2">
        <p className="text-sm text-slate-400">Plano atual</p>
        <p className="text-2xl font-semibold text-white">{user?.plan ?? "free"}</p>
        <Badge>Upgrade em breve</Badge>
      </Card>
      <Card className="space-y-2">
        <p className="text-sm text-slate-400">Criações totais</p>
        <p className="text-2xl font-semibold text-white">{history.length}</p>
        <p className="text-xs text-slate-500">Histórico sincronizado localmente</p>
      </Card>
      <Card className="space-y-2">
        <p className="text-sm text-slate-400">Criações nos últimos 7 dias</p>
        <p className="text-2xl font-semibold text-white">{creationsThisWeek}</p>
        <p className="text-xs text-slate-500">
          Última geração:{" "}
          {history[0] ? formatDate(history[0].createdAt) : "nenhuma criação ainda"}
        </p>
      </Card>
    </section>
  );
}
