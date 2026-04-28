"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

export default function DesignsPage() {
  const [designs, setDesigns] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [clientId, setClientId] = useState("");

  const userId = "9c77970e-297f-4f12-8dc0-3dfde1c45d5b";

  async function fetchDesigns(selectedClient?: string) {
    const url = selectedClient
      ? `/api/designs?userId=${userId}&clientId=${selectedClient}`
      : `/api/designs?userId=${userId}`;

    const res = await fetch(url);
    const data = await res.json();
    setDesigns(data);
  }

  useEffect(() => {
    fetch(`/api/clientes?userId=${userId}`)
      .then((res) => res.json())
      .then(setClients);

    fetchDesigns();
  }, []);

  function handleFilter(e: any) {
    const id = e.target.value;
    setClientId(id);
    fetchDesigns(id);
  }

  function reusePrompt(prompt: string) {
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
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {designs.length === 0 ? (
        <div className="cc-card rounded-2xl p-6 text-slate-400">
          Nenhum design encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {designs.map((d) => (
            <article key={d.id} className="cc-card overflow-hidden rounded-2xl">
              {d.image_url && (
                <img
                  src={d.image_url}
                  alt="Design"
                  className="h-72 w-full object-cover"
                />
              )}

              <div className="p-4">
                <p className="line-clamp-3 text-sm text-slate-300">{d.prompt}</p>

                <button
                  onClick={() => reusePrompt(d.prompt)}
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
