"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function QuickActions() {
  return (
    <Card className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-white">Fluxo rápido</h2>
        <p className="text-sm text-slate-400">
          Acesse as áreas principais para gerar e gerenciar campanhas.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/gerar">
          <Button>Gerar nova imagem</Button>
        </Link>
        <Link href="/historico">
          <Button variant="secondary">Ver histórico</Button>
        </Link>
      </div>
    </Card>
  );
}
