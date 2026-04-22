"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function HomeHero() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-16">
      <div className="space-y-4">
        <p className="inline-flex rounded-full border border-violet-300/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
          SaaS | AI Fashion Generation
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
          CreativeClip 3D-AI Fashion Hub para criar campanhas visuais em minutos.
        </h1>
        <p className="max-w-2xl text-slate-300">
          Faça upload da roupa base, descreva o estilo no prompt e gere imagens de
          moda 3D com IA, mantendo o histórico de cada criação no seu dashboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link href="/login">
          <Button>Entrar na plataforma</Button>
        </Link>
        <Link href="/cadastro">
          <Button variant="secondary">Criar conta gratuita</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Auth com Supabase", value: "Login + Cadastro" },
          { title: "Geração IA", value: "Mock Replicate pronto" },
          { title: "Histórico", value: "Visualize e baixe imagens" },
        ].map((item) => (
          <Card key={item.title} className="space-y-1">
            <p className="text-sm text-slate-400">{item.title}</p>
            <p className="text-lg font-semibold text-white">{item.value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
