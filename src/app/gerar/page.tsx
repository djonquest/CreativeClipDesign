"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default function GerarPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");

  // 🔐 carregar usuário + clientes
  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);

      // carregar clientes
      const res = await fetch(`/api/clients?userId=${user.id}`);
      const data = await res.json();
      setClients(data);
    }

    init();
  }, []);

  async function handleGenerate() {
    if (!prompt) {
      alert("Digite uma descrição");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          userId,
          clientId: clientId || null,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setLoading(false);
        return;
      }

      setImage(data.image);
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar imagem");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Gerar roupa com IA
      </h1>

      {/* Cliente */}
      <select
        className="w-full border p-2 mb-4 rounded"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
      >
        <option value="">Sem cliente (geral)</option>
        {clients.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Prompt */}
      <textarea
        className="w-full border p-3 mb-4 rounded"
        placeholder="Descreva a roupa... Ex: vestido elegante vermelho com tecido leve"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Botão */}
      <button
        onClick={handleGenerate}
        className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-3 rounded w-full font-semibold"
      >
        {loading ? "Gerando..." : "Gerar com IA"}
      </button>

      {/* Resultado */}
      {image && (
        <div className="mt-6">
          <img
            src={image}
            alt="resultado"
            className="w-full rounded-lg shadow"
          />
        </div>
      )}
    </div>
  );
}