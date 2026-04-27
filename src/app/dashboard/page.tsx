"use client";

import { useEffect, useState } from "react";
import AppNav from "@/components/appnav";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const profileRes = await fetch(`/api/profile?userId=${user.id}`);
      setProfile(await profileRes.json());

      const clientsRes = await fetch(`/api/clients?userId=${user.id}`);
      setClients(await clientsRes.json());

      const ordersRes = await fetch(`/api/orders?userId=${user.id}`);
      setOrders(await ordersRes.json());

      const designsRes = await fetch(`/api/designs?userId=${user.id}`);
      setDesigns(await designsRes.json());
    }

    init();
  }, []);

  const lateOrders = orders.filter((order) => {
    if (!order.delivery_date) return false;
    if (order.status === "done" || order.status === "delivered") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delivery = new Date(order.delivery_date);
    delivery.setHours(0, 0, 0, 0);

    return delivery < today;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNav />

      <main className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500">Plano</p>
            <p className="text-2xl font-bold">{profile?.plan || "Starter"}</p>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500">Créditos</p>
            <p className="text-2xl font-bold text-green-600">
              {profile?.credits ?? 0}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500">Clientes</p>
            <p className="text-2xl font-bold">{clients.length}</p>
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <p className="text-gray-500">Designs</p>
            <p className="text-2xl font-bold">{designs.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Pedidos atrasados</h2>

            {lateOrders.length === 0 ? (
              <p className="text-gray-500">Nenhum pedido atrasado.</p>
            ) : (
              <div className="space-y-3">
                {lateOrders.map((order) => (
                  <div key={order.id} className="border border-red-300 p-3 rounded">
                    <p className="font-semibold">R$ {Number(order.price || 0).toFixed(2)}</p>
                    <p>Entrega: {order.delivery_date}</p>
                    <p>Status: {order.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border rounded-xl p-5 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Ações rápidas</h2>

            <div className="space-y-3">
              <a href="/clientes" className="block bg-black text-white p-3 rounded-lg text-center">
                Novo Cliente
              </a>

              <a href="/pedidos" className="block border p-3 rounded-lg text-center">
                Novo Pedido
              </a>

              <a href="/gerar" className="block bg-gradient-to-r from-purple-600 to-pink-500 text-white p-3 rounded-lg text-center">
                Gerar Design com IA
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}