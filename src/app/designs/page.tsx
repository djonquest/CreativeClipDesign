"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { getCurrentUser } from "@/lib/getCurrentUser";

type Client = {
  id: string;
  name?: string;
};

type Design = {
  id: string;
  image_url?: string | null;
  prompt?: string | null;
};

function toArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? data.filter(Boolean) : [];
}

export default function DesignsPage() {
  const [userId, setUserId] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchDesigns(id: string, selectedClient?: string) {
    try {
      const url = selectedClient
        ? `/api/designs?userId=${id}&clientId=${selectedClient}`
        : `/api/designs?userId=${id}`;

      const res = await fetch(url);
      const data = await res.json();
      setDesigns(toArray<Design>(data));
    } catch (err) {
      console.error("Erro ao carregar designs:", err);
      setDesigns([]);
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const user = await getCurrentUser();

        if (!user) {
          window.location.href = "/site";
          return;
        }

        setUserId(user.id);

        const clientsRes = await fetch(`/api/clientes?userId=${user.id}`);
        const clientsData = await clientsRes.json();
        setClients(toArray<Client>(clientsData));

        await fetchDesigns(user.id);
      } catch (err) {
        console.error("Erro ao iniciar designs:", err);
        setClients([]);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  function handleFilter(e: ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    setClientId(id);
    if (userId) fetchDesigns(userId, id);
  }

  function reusePrompt(prompt?: string | null) {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    alert("Prompt copiado!");
  }

  return (
    <AppShell title="Historico de designs">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <select
          className="cc-input max-w-sm px-4 py-3"
          value={clientId}
          onChange={handleFilter}
        >
          <option value="">Todos clientes</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name || "Cliente sem nome"}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="cc-card rounded-2xl p-6 text-slate-400">
          Carregando designs...
        </div>
      ) : designs.length === 0 ? (
        <div className="cc-card rounded-2xl p-6 text-slate-400">
          Nenhum design encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {designs.map((design) => (
            <article
              key={design.id}
              className="cc-card overflow-hidden rounded-2xl"
            >
              {design.image_url && (
                <img
                  src={design.image_url}
                  alt="Design"
                  className="h-72 w-full object-cover"
                />
              )}

              <div className="p-4">
                <p className="line-clamp-3 text-sm text-slate-300">
                  {design.prompt || "Sem prompt salvo."}
                </p>

                <button
                  onClick={() => reusePrompt(design.prompt)}
                  disabled={!design.prompt}
                  className="cc-button-secondary mt-4 w-full px-4 py-3 text-sm"
                >
                  Reutilizar prompt
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
