"use client";

import { HistoryList } from "@/components/history/history-list";
import { useAppContext } from "@/components/providers/app-provider";
import { Card } from "@/components/ui/card";

export function HistoryContent() {
  const { history } = useAppContext();

  return (
    <section className="space-y-4">
      <Card className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">Histórico de criações</h1>
        <p className="text-sm text-slate-400">
          Visualize cada prompt já utilizado e abra a imagem final para download.
        </p>
      </Card>
      <HistoryList items={history} />
    </section>
  );
}
