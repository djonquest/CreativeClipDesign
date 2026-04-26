"use client";

import { useEffect, useState } from "react";
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

      const clientsRes = await fetch(`/api/clients?userId=${user.id}`);
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

  function getClientName(id?: string) {
    const client = clients.find((c) => c.id === id);
    return client?.name || "Cliente não informado";
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>

      <div className="border rounded-xl p-5 mb-6 shadow-sm bg-white space-y-3">
        <h2 className="text-xl font-semibold">Novo Pedido</h2>

        <select
          className="border p-2 w-full rounded"
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
          className="border p-2 w-full rounded"
          placeholder="Valor (R$)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 w-full rounded"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Observações do pedido"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 rounded-lg w-full font-semibold"
        >
          {loading ? "Criando..." : "Criar Pedido"}
        </button>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const late = isLate(order.delivery_date, order.status);

          return (
            <div
              key={order.id}
              className={`border rounded-xl p-4 shadow-sm bg-white ${
                late ? "border-red-500" : ""
              }`}
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-bold">{getClientName(order.client_id)}</p>
                  <p>R$ {Number(order.price || 0).toFixed(2)}</p>
                  <p>Entrega: {order.delivery_date || "-"}</p>
                  <p>Status: {order.status}</p>

                  {order.notes && (
                    <p className="text-sm text-gray-600 mt-2">
                      {order.notes}
                    </p>
                  )}

                  {late && (
                    <p className="text-red-500 font-semibold mt-2">
                      Pedido atrasado
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 text-sm">
                  <button
                    onClick={() => handleStatus(order.id, "in_progress")}
                    className="text-blue-600"
                  >
                    Em andamento
                  </button>

                  <button
                    onClick={() => handleStatus(order.id, "done")}
                    className="text-green-600"
                  >
                    Concluído
                  </button>

                  <button
                    onClick={() => handleStatus(order.id, "delivered")}
                    className="text-purple-600"
                  >
                    Entregue
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <p className="text-gray-500">Nenhum pedido cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}