"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

type Profile = {
  plan?: string | null;
  credits?: number | null;
};

type Order = {
  id: string;
  status?: string | null;
  delivery_date?: string | null;
  price?: number | string | null;
};

function toArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [clients, setClients] = useState<unknown[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [designs, setDesigns] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          window.location.href = "/site";
          return;
        }

        const profileRes = await fetch(`/api/profile?userId=${user.id}`);
        const profileData = await profileRes.json();
        setProfile(profileData && !Array.isArray(profileData) ? profileData : null);

        const clientsRes = await fetch(`/api/clientes?userId=${user.id}`);
        const clientsData = await clientsRes.json();
        setClients(toArray<unknown>(clientsData));

        const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
        const ordersData = await ordersRes.json();
        setOrders(toArray<Order>(ordersData));

        const designsRes = await fetch(`/api/designs?userId=${user.id}`);
        const designsData = await designsRes.json();
        setDesigns(toArray<unknown>(designsData));
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setProfile(null);
        setClients([]);
        setOrders([]);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  const lateOrders = orders.filter((order) => {
    if (!order?.delivery_date) return false;
    if (order.status === "done" || order.status === "delivered") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delivery = new Date(order.delivery_date);
    delivery.setHours(0, 0, 0, 0);

    return delivery < today;
  });

  if (loading) {
    return (
      <AppShell title="Dashboard">
        <div className="cc-card rounded-2xl p-6 text-slate-400">
          Carregando dashboard...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dashboard"
      action={
        <Link href="/gerar" className="cc-button-primary px-5 py-3 text-sm">
          Gerar design
        </Link>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          ["Plano", profile?.plan || "Starter"],
          ["Creditos", profile?.credits ?? 0],
          ["Clientes", clients.length],
          ["Designs", designs.length],
        ].map(([label, value]) => (
          <div key={String(label)} className="cc-card rounded-2xl p-5">
            <p className="text-sm font-semibold text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-black text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="cc-card rounded-2xl p-6">
          <h2 className="text-xl font-black text-white">Pedidos atrasados</h2>

          {lateOrders.length === 0 ? (
            <p className="mt-4 text-slate-400">Nenhum pedido atrasado.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {lateOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4"
                >
                  <p className="font-bold text-white">
                    R$ {Number(order.price || 0).toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">
                    Entrega: {order.delivery_date || "-"}
                  </p>
                  <p className="text-sm text-red-200">
                    Status: {order.status || "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="cc-card rounded-2xl p-6">
          <h2 className="text-xl font-black text-white">Acoes rapidas</h2>

          <div className="mt-4 space-y-3">
            <Link
              href="/clientes"
              className="cc-button-secondary block px-4 py-3 text-center"
            >
              Novo cliente
            </Link>

            <Link
              href="/pedidos"
              className="cc-button-secondary block px-4 py-3 text-center"
            >
              Novo pedido
            </Link>

            <Link
              href="/gerar"
              className="cc-button-primary block px-4 py-3 text-center"
            >
              Gerar design com IA
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
