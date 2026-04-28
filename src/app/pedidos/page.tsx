"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

type Order = {
  id: string;
  client_id?: string;
  status: string;
  delivery_date: string;
  price: number;
  notes?: string;
};

export default function PedidosPage() {
  const [userId, setUserId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  const [clientId, setClientId] = useState("");
  const [price, setPrice] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);

      const clientsRes = await fetch(`/api/clientes?userId=${user.id}`);
      const clientsData = await clientsRes.json();
      setClients(clientsData);

      await fetchOrders(user.id);
    }

    init();
  }, []);

  async function fetchOrders(id = userId) {
    if (!id) return;

    const res = await fetch(`/api/orders?userId=${id}`);
    const data = await res.json();

    setOrders(data || []);
  }

  async function handleCreate() {
    if (!price || !deliveryDate) {
      alert("Informe o valor e a data de entrega");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          client_id: clientId || null,
          price: Number(price),
          delivery_date: deliveryDate,
          notes,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setClientId("");
      setPrice("");
      setDeliveryDate("");
      setNotes("");

      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatus(id: string, status: string) {
    await fetch("/api/orders", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, status }),
    });

    await fetchOrders();
  }

  function handleCancel() {
    setClientId("");
    setPrice("");
    setDeliveryDate("");
    setNotes("");
    window.history.back();
  }

  function getClientName(id?: string) {
    const client = clients.find((c) => c.id === id);
    return client?.name || "Cliente nao informado";
  }

  function isLate(date: string, status: string) {
    if (!date) return false;
    if (status === "done" || status === "delivered") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const delivery = new Date(date);
    delivery.setHours(0, 0, 0, 0);

    return delivery < today;
  }

  return (
    <AppShell title="Pedidos">
      <div className="grid gap-6 xl:grid-cols-[460px_1fr]">
        <section className="cc-card rounded-2xl p-6">
          <h2 className="text-xl font-black text-white">Novo pedido</h2>

          <div className="mt-5 space-y-4">
            <select
              className="cc-input px-4 py-3"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Selecionar cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>

            <input
              className="cc-input px-4 py-3"
              placeholder="Valor (R$)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="date"
              className="cc-input px-4 py-3"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />

            <textarea
              className="cc-input min-h-28 px-4 py-3"
              placeholder="Observacoes do pedido"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCancel}
                className="cc-button-secondary w-full px-4 py-3"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="cc-button-primary w-full px-4 py-3"
              >
                {loading ? "Criando..." : "Criar pedido"}
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {orders.map((order) => {
            const late = isLate(order.delivery_date, order.status);

            return (
              <div
                key={order.id}
                className={`cc-card rounded-2xl p-5 ${
                  late ? "border-red-400/40 bg-red-500/10" : ""
                }`}
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <p className="font-bold text-white">
                      {getClientName(order.client_id)}
                    </p>
                    <p className="mt-2 text-slate-300">
                      R$ {Number(order.price || 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Entrega: {order.delivery_date || "-"}
                    </p>
                    <p className="text-sm text-slate-400">
                      Status: {order.status}
                    </p>

                    {order.notes && (
                      <p className="mt-3 text-sm text-slate-300">{order.notes}</p>
                    )}

                    {late && (
                      <p className="mt-3 text-sm font-bold text-red-200">
                        Pedido atrasado
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm md:flex-col">
                    <button
                      onClick={() => handleStatus(order.id, "in_progress")}
                      className="cc-button-secondary px-3 py-2"
                    >
                      Em andamento
                    </button>

                    <button
                      onClick={() => handleStatus(order.id, "done")}
                      className="cc-button-secondary px-3 py-2"
                    >
                      Concluido
                    </button>

                    <button
                      onClick={() => handleStatus(order.id, "delivered")}
                      className="cc-button-secondary px-3 py-2"
                    >
                      Entregue
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="cc-card rounded-2xl p-6 text-slate-400">
              Nenhum pedido cadastrado ainda.
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
