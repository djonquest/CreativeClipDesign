"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default function MedidasPage() {
  const [userId, setUserId] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");

  const [size, setSize] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 carregar usuário + clientes
  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);

      const res = await fetch(`/api/clients?userId=${user.id}`);
      const data = await res.json();
      setClients(data);
    }

    init();
  }, []);

  async function handleSave() {
    if (!clientId) {
      alert("Selecione um cliente");
      return;
    }

    setLoading(true);

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

      if (data.error) {
        alert(data.error);
        return;
      }

      alert("Medidas salvas com sucesso!");

      // limpar campos
      setSize("");
      setBust("");
      setWaist("");
      setHip("");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar medidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Medidas do Cliente</h1>

      {/* Cliente */}
      <select
        className="w-full border p-2 mb-4 rounded"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
      >
        <option value="">Selecionar cliente</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Tamanho */}
      <select
        className="w-full border p-2 mb-4 rounded"
        value={size}
        onChange={(e) => setSize(e.target.value)}
      >
        <option value="">Tamanho padrão</option>
        <option>P</option>
        <option>M</option>
        <option>G</option>
      </select>

      {/* Medidas */}
      <input
        className="w-full border p-2 mb-2 rounded"
        placeholder="Busto (cm)"
        value={bust}
        onChange={(e) => setBust(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-2 rounded"
        placeholder="Cintura (cm)"
        value={waist}
        onChange={(e) => setWaist(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4 rounded"
        placeholder="Quadril (cm)"
        value={hip}
        onChange={(e) => setHip(e.target.value)}
      />

      {/* Botão */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 w-full rounded-lg font-semibold"
      >
        {loading ? "Salvando..." : "Salvar Medidas"}
      </button>
    </div>
  );
}