"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { supabaseClient } from "@/lib/supabaseClient";

export default function PerfilPage() {
  const [profile, setProfile] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const user = await getCurrentUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    setUserId(user.id);

    const res = await fetch(`/api/profile?userId=${user.id}`);
    const data = await res.json();

    setProfile(data);
    setLoading(false);
  }

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/login";
  }

  async function handleBillingPortal() {
    const res = await fetch("/api/stripe/portal", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Nao foi possivel abrir o faturamento");
    }
  }

  async function handleUpgrade() {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY,
        userId,
      }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <AppShell title="Meu perfil">
        <div className="cc-card rounded-2xl p-6 text-slate-400">
          Carregando...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Meu perfil">
      <div className="mx-auto max-w-2xl">
        <section className="cc-card rounded-2xl p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <p className="text-sm font-semibold text-slate-400">Email</p>
              <p className="mt-2 text-lg font-bold text-white">
                {profile?.email || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Plano</p>
              <p className="mt-2 text-2xl font-black text-white">
                {profile?.plan || "Starter"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
              <p className="text-sm text-slate-400">Creditos</p>
              <p className="mt-2 text-2xl font-black text-emerald-300">
                {profile?.credits ?? 0}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-3">
          <button
            onClick={handleUpgrade}
            className="cc-button-primary w-full px-4 py-3"
          >
            Fazer upgrade
          </button>

          <button
            onClick={handleBillingPortal}
            className="cc-button-secondary w-full px-4 py-3"
          >
            Gerenciar faturamento
          </button>

          <button
            onClick={handleLogout}
            className="w-full rounded-2xl bg-red-500/10 px-4 py-3 font-bold text-red-200 transition hover:bg-red-500/20"
          >
            Sair
          </button>
        </section>
      </div>
    </AppShell>
  );
}
