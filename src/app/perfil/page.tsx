"use client";

import { useEffect, useState } from "react";
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
      alert(data.error || "Não foi possível abrir o faturamento");
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

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

      <div className="border rounded-xl p-5 mb-6 shadow-sm bg-white">
        <p className="mb-2">
          <strong>Email:</strong> {profile?.email || "-"}
        </p>

        <p className="mb-2">
          <strong>Plano:</strong>{" "}
          <span className="font-semibold">{profile?.plan || "Starter"}</span>
        </p>

        <p className="text-lg">
          <strong>Créditos:</strong>{" "}
          <span className="text-green-600 font-bold">
            {profile?.credits ?? 0}
          </span>
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleUpgrade}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 w-full rounded-lg font-semibold"
        >
          Fazer Upgrade
        </button>

        <button
          onClick={handleBillingPortal}
          className="border px-4 py-3 w-full rounded-lg"
        >
          Gerenciar Faturamento
        </button>

        <button onClick={handleLogout} className="text-red-500 w-full py-2">
          Sair
        </button>
      </div>
    </div>
  );
}