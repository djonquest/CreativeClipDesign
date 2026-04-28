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

const features = [
  ["Clientes organizados", "Cadastre clientes, medidas, preferências e histórico em um só lugar."],
  ["Pedidos e prazos", "Acompanhe entregas, valores, status e evite atrasos no ateliê."],
  ["Designs com IA", "Crie ideias visuais, salve versões e reutilize designs no futuro."],
  ["Medidas salvas", "Use medidas reais para criar peças mais personalizadas."],
  ["Histórico visual", "Monte uma galeria por cliente e mostre opções com mais profissionalismo."],
  ["Créditos flexíveis", "Assinaturas mensais e pacotes avulsos para continuar criando."],
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

  async function handleGoogleLogin() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      alert("Digite seu email primeiro.");
      return;
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/perfil`,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Enviamos um link de recuperação para seu email.");
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
    <main className="min-h-screen bg-[#070816] text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.25),transparent_30%)]" />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070816]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-black">
              CC
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">CreativeClip</h1>
              <p className="text-xs text-slate-400">Fashion AI Studio</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#beneficios" className="hover:text-white">Benefícios</a>
            <a href="#planos" className="hover:text-white">Planos</a>
            <a href="#como-funciona" className="hover:text-white">Como funciona</a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => setModal("login")}
              className="px-5 py-2 rounded-full border border-white/15 hover:bg-white/10"
            >
              Entrar
            </button>

            <button
              onClick={() => setModal("cadastro")}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 font-semibold shadow-lg shadow-pink-500/20"
            >
              Começar
            </button>
          </div>
        </div>
      </header>

      <section className="px-6 pt-20 pb-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-slate-200">
            ✨ SaaS premium para moda sob medida
          </div>

          <h2 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
            Crie peças com IA e organize seu ateliê com elegância.
          </h2>

          <p className="mt-6 text-xl text-slate-300 max-w-2xl leading-relaxed">
            Clientes, medidas, pedidos, prazos, histórico visual e geração de designs com IA para costureiras, estilistas e ateliês.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setModal("cadastro")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold shadow-xl shadow-pink-500/20"
            >
              Criar minha conta
            </button>

            <button
              onClick={() => setModal("login")}
              className="px-8 py-4 rounded-2xl border border-white/15 hover:bg-white/10 font-semibold"
            >
              Já tenho conta
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10">Sem caderninho</span>
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10">Medidas por cliente</span>
            <span className="px-4 py-2 rounded-full bg-white/10 border border-white/10">IA + histórico</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-30 rounded-full" />

          <div className="relative rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.5rem] bg-slate-950 border border-white/10 p-5 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-slate-400">Pedido em andamento</p>
                  <h3 className="text-2xl font-black mt-2">Vestido festa vermelho</h3>
                  <p className="text-slate-300 mt-2">Entrega: 30/04 • Cliente: Maria</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs">IA</span>
              </div>

              <div className="mt-5 h-52 rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-cyan-400/20 border border-white/10 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-5xl">👗</p>
                  <p className="text-sm text-slate-300 mt-2">Preview do design</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-950 rounded-2xl p-5 border border-white/10">
                <p className="text-slate-400 text-sm">Clientes</p>
                <p className="text-3xl font-black">128</p>
              </div>

              <div className="bg-slate-950 rounded-2xl p-5 border border-white/10">
                <p className="text-slate-400 text-sm">Designs</p>
                <p className="text-3xl font-black">842</p>
              </div>

              <div className="bg-slate-950 rounded-2xl p-5 border border-white/10">
                <p className="text-slate-400 text-sm">Prazos</p>
                <p className="text-3xl font-black">12</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="px-6 py-20 bg-white text-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-bold mb-2">Tudo organizado</p>
            <h2 className="text-4xl lg:text-5xl font-black">
              O sistema que substitui o caderninho do ateliê.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(([title, desc]) => (
              <div key={title} className="rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-xl transition bg-white">
                <div className="h-12 w-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 font-black">
                  ✓
                </div>
                <h3 className="text-xl font-black mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="px-6 py-20 bg-slate-100 text-slate-950">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
          {[
            ["1", "Cadastre clientes", "Salve dados, medidas e preferências de cada cliente."],
            ["2", "Crie com IA", "Gere peças a partir de ideias, medidas e referências."],
            ["3", "Acompanhe pedidos", "Controle prazos, valores, status e histórico visual."],
          ].map(([step, title, desc]) => (
            <div key={step} className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm">
              <p className="text-5xl font-black text-purple-600 mb-4">{step}</p>
              <h3 className="text-2xl font-black mb-3">{title}</h3>
              <p className="text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="px-6 py-24 bg-white text-slate-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-black text-center mb-4">
            Planos para cada fase do seu ateliê
          </h2>

          <p className="text-center text-slate-600 mb-14">
            Assine agora ou comece criando sua conta e faça upgrade quando precisar.
          </p>

          <div className="grid md:grid-cols-3 gap-7">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-[2rem] p-8 border shadow-xl ${
                  plan.featured
                    ? "bg-gradient-to-br from-purple-950 to-pink-900 text-white scale-105 border-purple-400"
                    : "bg-white text-slate-950 border-slate-200"
                }`}
              >
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-2xl font-black">{plan.name}</h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      plan.featured ? "bg-white/20" : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {plan.tag}
                  </span>
                </div>

                <p className="text-4xl font-black mb-7">{plan.price}</p>

                <ul className="space-y-3 mb-8">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3">
                      <span className={plan.featured ? "text-pink-200" : "text-purple-600"}>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan.priceId)}
                  className={`w-full py-4 rounded-2xl font-black ${
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

      <footer className="px-6 py-10 border-t border-white/10 text-center text-slate-400">
        CreativeClip © {new Date().getFullYear()} — Moda, IA e gestão para ateliês.
      </footer>

      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white text-slate-950 w-full max-w-md rounded-[2rem] p-7 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-black">
                  {modal === "login" ? "Entrar" : "Criar conta"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {modal === "login"
                    ? "Acesse seu painel CreativeClip."
                    : "Comece a organizar seu ateliê hoje."}
                </p>
              </div>

              <button onClick={() => setModal(null)} className="text-2xl">
                ×
              </button>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-2xl border border-slate-200 font-bold mb-4 hover:bg-slate-50"
            >
              Entrar com Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs text-slate-400">ou email</span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <input
              className="border border-slate-200 p-3 w-full rounded-2xl mb-3 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="border border-slate-200 p-3 w-full rounded-2xl mb-3 outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {modal === "login" && (
              <button
                onClick={handleForgotPassword}
                className="text-sm text-purple-600 font-bold mb-5"
              >
                Esqueci minha senha
              </button>
            )}

            <button
              onClick={modal === "login" ? handleLogin : handleCadastro}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black"
            >
              {modal === "login" ? "Entrar" : "Criar conta"}
            </button>

            <p className="text-center text-sm mt-5">
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