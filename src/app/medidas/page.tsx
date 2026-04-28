"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

type Client = {
  id: string;
  name?: string;
};

function toArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export default function MedidasPage() {
  const [userId, setUserId] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");

  const [size, setSize] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          window.location.href = "/site";
          return;
        }

        setUserId(user.id);

        const res = await fetch(`/api/clientes?userId=${user.id}`);
        const data = await res.json();
        setClients(toArray<Client>(data));
      } catch (err) {
        console.error("Erro ao carregar medidas:", err);
        setClients([]);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function handleSave() {
    if (!clientId) {
      alert("Selecione um cliente");
      return;
    }

    if (!userId) return;

    setSaving(true);

    try {
      const res = await fetch("/api/measurements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          client_id: clientId,
          size,
          bust: bust ? Number(bust) : null,
          waist: waist ? Number(waist) : null,
          hip: hip ? Number(hip) : null,
        }),
      });

      const data = await res.json();

      if (data?.error) {
        alert(data.error);
        return;
      }

      alert("Medidas salvas com sucesso!");

      setSize("");
      setBust("");
      setWaist("");
      setHip("");
    } catch (err) {
      console.error("Erro ao salvar medidas:", err);
      alert("Erro ao salvar medidas");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setClientId("");
    setSize("");
    setBust("");
    setWaist("");
    setHip("");
    window.history.back();
  }

  return (
    <AppShell title="Medidas do cliente">
      <section className="cc-card mx-auto max-w-2xl rounded-2xl p-6">
        <h2 className="text-xl font-black text-white">Ficha de medidas</h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <select
            className="cc-input px-4 py-3 sm:col-span-2"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">
              {loading ? "Carregando clientes..." : "Selecionar cliente"}
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name || "Cliente sem nome"}
              </option>
            ))}
          </select>

          <select
            className="cc-input px-4 py-3 sm:col-span-2"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option value="">Tamanho padrao</option>
            <option>P</option>
            <option>M</option>
            <option>G</option>
          </select>

          <input
            className="cc-input px-4 py-3"
            placeholder="Busto (cm)"
            value={bust}
            onChange={(e) => setBust(e.target.value)}
          />

          <input
            className="cc-input px-4 py-3"
            placeholder="Cintura (cm)"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />

          <input
            className="cc-input px-4 py-3 sm:col-span-2"
            placeholder="Quadril (cm)"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
          />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleCancel}
            className="cc-button-secondary w-full px-4 py-3"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !userId}
            className="cc-button-primary w-full px-4 py-3"
          >
            {saving ? "Salvando..." : "Salvar medidas"}
          </button>
        </div>
      </section>
    </AppShell>
  );
}
