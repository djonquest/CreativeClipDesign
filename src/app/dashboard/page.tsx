"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
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
        setProfile(profileData || null);

        const clientsRes = await fetch(`/api/clientes?userId=${user.id}`);
        const clientsData = await clientsRes.json();
        setClients(Array.isArray(clientsData) ? clientsData : []);

        const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
        const ordersData = await ordersRes.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);

        const designsRes = await fetch(`/api/designs?userId=${user.id}`);
        const designsData = await designsRes.json();
        setDesigns(Array.isArray(designsData) ? designsData : []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
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
      <AppShell>
        <p className="text-slate-300">Carregando dashboard...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm text-purple-300 font-semibold">
            Visão geral
          </p>
          <h1 className="text-4xl font-black text-white mt-2">
            Dashboard
          </h1>
          <p className="text-slate-300 mt-2">
            Acompanhe seus créditos, clientes, designs e pedidos em atraso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl">
            <p className="text-slate-400">Plano</p>
            <p className="text-3xl font-black text-white mt-2">
              {profile?.plan || "Starter"}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl">
            <p className="text-slate-400">Créditos</p>
            <p className="text-3xl font-black text-green-400 mt-2">
              {profile?.credits ?? 0}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl">
            <p className="text-slate-400">Clientes</p>
            <p className="text-3xl font-black text-white mt-2">
              {clients.length}
            </p>
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl">
            <p className="text-slate-400">Designs</p>
            <p className="text-3xl font-black text-white mt-2">
              {designs.length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl min-h-64">
            <h2 className="text-2xl font-black text-white mb-4">
              Pedidos atrasados
            </h2>

            {lateOrders.length === 0 ? (
              <p className="text-slate-300">Nenhum pedido atrasado.</p>
            ) : (
              <div className="space-y-3">
                {lateOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-red-400/40 bg-red-500/10 rounded-2xl p-4"
                  >
                    <p className="font-bold text-white">
                      R$ {Number(order.price || 0).toFixed(2)}
                    </p>
                    <p className="text-slate-300">
                      Entrega: {order.delivery_date}
                    </p>
                    <p className="text-slate-300">
                      Status: {order.status}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-4">
              Ações rápidas
            </h2>

            <div className="space-y-3">
              <a
                href="/clientes"
                className="block text-center bg-white text-slate-950 p-4 rounded-2xl font-bold"
              >
                Novo Cliente
              </a>

              <a
                href="/pedidos"
                className="block text-center border border-white/15 text-white p-4 rounded-2xl font-bold hover:bg-white/10"
              >
                Novo Pedido
              </a>

              <a
                href="/gerar"
                className="block text-center bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 rounded-2xl font-bold"
              >
                Gerar Design com IA
              </a>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}