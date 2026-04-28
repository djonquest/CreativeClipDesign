"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default function GerarPage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setUserId(user.id);

      const res = await fetch(`/api/clientes?userId=${user.id}`);
      const data = await res.json();
      setClients(data);
    }

    init();
  }, []);

  async function handleGenerate() {
    if (!prompt) {
      alert("Digite uma descricao");
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

  function handleCancel() {
    setClientId("");
    setPrompt("");
    setImage(null);
    window.history.back();
  }

  return (
    <AppShell title="Gerar roupa com IA">
      <div className="grid gap-6 lg:grid-cols-[460px_1fr]">
        <section className="cc-card rounded-2xl p-6">
          <h2 className="text-xl font-black text-white">Novo conceito</h2>

          <div className="mt-5 space-y-4">
            <select
              className="cc-input px-4 py-3"
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

            <textarea
              className="cc-input min-h-44 px-4 py-3"
              placeholder="Descreva a roupa... Ex: vestido elegante vermelho com tecido leve"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleCancel}
                className="cc-button-secondary w-full px-4 py-3"
              >
                Cancelar
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="cc-button-primary w-full px-4 py-3"
              >
                {loading ? "Gerando..." : "Gerar com IA"}
              </button>
            </div>
          </div>
        </section>

        <section className="cc-card flex min-h-[420px] items-center justify-center rounded-2xl p-4">
          {image ? (
            <img
              src={image}
              alt="Resultado gerado"
              className="max-h-[720px] w-full rounded-2xl object-cover shadow-2xl shadow-black/40"
            />
          ) : (
            <div className="max-w-sm text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-pink-300">
                Preview
              </p>
              <p className="mt-3 text-slate-400">
                O resultado gerado pela IA aparece aqui.
              </p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
