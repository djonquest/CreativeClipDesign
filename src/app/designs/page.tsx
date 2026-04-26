"use client";

import { useEffect, useState } from "react";

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
    fetch(`/api/clients?userId=${userId}`)
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Histórico de Designs</h1>

      {/* filtro por cliente */}
      <select
        className="border p-2 mb-4"
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

      {/* galeria */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {designs.map((d) => (
          <div key={d.id} className="border p-2">
            {d.image_url && (
              <img
                src={d.image_url}
                alt="design"
                className="w-full h-60 object-cover"
              />
            )}

            <p className="text-xs mt-2 line-clamp-3">{d.prompt}</p>

            <button
              onClick={() => reusePrompt(d.prompt)}
              className="mt-2 text-blue-500 text-sm"
            >
              Reutilizar prompt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}