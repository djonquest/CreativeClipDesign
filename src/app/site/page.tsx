"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

const plans = [
  {
    name: "Starter",
    price: "R$ 79/mês",
    tag: "Comece agora",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY,
    benefits: [
      "30 créditos por mês",
      "Cadastro de clientes",
      "Controle de medidas",
      "Histórico de designs",
      "Controle simples de pedidos",
    ],
  },
  {
    name: "Pro",
    price: "R$ 197/mês",
    tag: "Mais popular",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
    featured: true,
    benefits: [
      "100 créditos por mês",
      "Geração de designs com IA",
      "Histórico por cliente",
      "Pedidos com prazo de entrega",
      "Portal de faturamento",
    ],
  },
  {
    name: "Elite",
    price: "R$ 397/mês",
    tag: "Ateliês premium",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY,
    benefits: [
      "300 créditos por mês",
      "Uso avançado para ateliês",
      "Prioridade em recursos novos",
      "Mais gerações mensais",
      "Ideal para alto volume",
    ],
  },
];

export default function SitePage() {
  const [modal, setModal] = useState<"login" | "cadastro" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard";
  }

  async function handleCadastro() {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Conta criada! Verifique seu email se a confirmação estiver ativa.");
    setModal("login");
  }

  async function handleCheckout(priceId?: string) {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      alert("Crie sua conta ou entre antes de assinar.");
      setModal("cadastro");
      return;
    }

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        priceId,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Não foi possível abrir o checkout.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-black tracking-tight">CreativeClip</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setModal("login")}
            className="px-5 py-2 rounded-full border border-white/20 hover:bg-white/10"
          >
            Entrar
          </button>

          <button
            onClick={() => setModal("cadastro")}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold"
          >
            Começar agora
          </button>
        </div>
      </header>

      <section className="px-8 pt-20 pb-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm">
            SaaS premium para moda sob medida
          </div>

          <h2 className="text-5xl lg:text-7xl font-black leading-tight">
            Crie peças com IA e organize seu ateliê em um só lugar.
          </h2>

          <p className="mt-6 text-xl text-slate-300 max-w-2xl">
            Clientes, medidas, pedidos, prazos, histórico visual e geração de designs com IA para costureiras, estilistas e ateliês.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => setModal("cadastro")}
              className="px-7 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold shadow-lg shadow-pink-500/20"
            >
              Criar minha conta
            </button>

            <button
              onClick={() => setModal("login")}
              className="px-7 py-4 rounded-xl border border-white/20 hover:bg-white/10"
            >
              Já tenho conta
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-30 rounded-full" />

          <div className="relative bg-white/10 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur">
            <div className="bg-slate-900 rounded-2xl p-5 mb-4">
              <p className="text-sm text-slate-400">Pedido em andamento</p>
              <h3 className="text-2xl font-bold mt-2">Vestido festa vermelho</h3>
              <p className="text-slate-300 mt-2">Entrega: 30/04 • Cliente: Maria</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-2xl p-5">
                <p className="text-slate-400">Clientes</p>
                <p className="text-3xl font-black">128</p>
              </div>

              <div className="bg-slate-900 rounded-2xl p-5">
                <p className="text-slate-400">Designs IA</p>
                <p className="text-3xl font-black">842</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-20 bg-white text-slate-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black text-center mb-4">
            Planos para cada fase do seu ateliê
          </h2>

          <p className="text-center text-slate-600 mb-12">
            Assine agora ou comece grátis e faça upgrade quando precisar.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-7 border shadow-xl ${
                  plan.featured
                    ? "bg-gradient-to-br from-purple-950 to-pink-900 text-white scale-105 border-purple-400"
                    : "bg-white text-slate-950 border-slate-200"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      plan.featured
                        ? "bg-white/20"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {plan.tag}
                  </span>
                </div>

                <p className="text-4xl font-black mb-6">{plan.price}</p>

                <ul className="space-y-3 mb-8">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-2">
                      <span>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.priceId)}
                  className={`w-full py-3 rounded-xl font-bold ${
                    plan.featured
                      ? "bg-white text-purple-900"
                      : "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                  }`}
                >
                  Assinar {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
          <div className="bg-white text-slate-950 w-full max-w-md rounded-3xl p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-black">
                {modal === "login" ? "Entrar" : "Criar conta"}
              </h2>

              <button onClick={() => setModal(null)} className="text-2xl">
                ×
              </button>
            </div>

            <input
              className="border p-3 w-full rounded-xl mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="border p-3 w-full rounded-xl mb-5"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={modal === "login" ? handleLogin : handleCadastro}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold"
            >
              {modal === "login" ? "Entrar" : "Criar conta"}
            </button>

            <p className="text-center text-sm mt-4">
              {modal === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
              <button
                onClick={() => setModal(modal === "login" ? "cadastro" : "login")}
                className="text-purple-600 font-bold"
              >
                {modal === "login" ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </div>
        </div>
      )}
    </main>
  );
}