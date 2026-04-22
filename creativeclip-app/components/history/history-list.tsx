"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { CreationRecord } from "@/types";

type HistoryListProps = {
  items: CreationRecord[];
};

export function HistoryList({ items }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-300">
          Nenhuma criação registrada ainda. Vá em <strong>Gerar IA</strong> para começar.
        </p>
      </Card>
    );
  }

  return (
    <section className="grid gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          className="grid gap-4 md:grid-cols-[220px_1fr] md:items-center"
        >
          <Image
            src={item.imageUrl}
            alt={`Resultado IA para ${item.prompt}`}
            width={440}
            height={320}
            className="h-40 w-full rounded-xl object-cover"
          />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{formatDate(item.createdAt)}</Badge>
              <Badge className="border-cyan-300/30 bg-cyan-500/10 text-cyan-100">
                {item.sourceImageName ?? "sem-upload"}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-slate-200">{item.prompt}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>{item.userEmail}</span>
              <a
                href={item.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-violet-300 hover:text-violet-200"
              >
                Abrir/baixar imagem
              </a>
            </div>
          </div>
        </Card>
      ))}
    </section>
  );
}
