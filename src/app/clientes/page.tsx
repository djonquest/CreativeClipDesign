"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";

type Client = {
  id: string;
  name: string;
  phone: string;
  notes?: string;
};

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const userId = "SEU_USER_ID_AQUI";

  async function fetchClients() {
    const res = await fetch(`/api/clientes?userId=${userId}`);
    const data = await res.json();
    setClients(data);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleCreate() {
    await fetch("/api/clientes", {
      method: "POST",
      body: JSON.stringify({ name, phone, notes, userId }),
    });

    setName("");
    setPhone("");
    setNotes("");
    fetchClients();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/clientes?id=${id}`, {
      method: "DELETE",
    });

    fetchClients();
  }

  function handleCancel() {
    setName("");
    setPhone("");
    setNotes("");
    window.history.back();
  }

  return (
    <AppShell title="Clientes">
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <section className="cc-card rounded-2xl p-6">
          <h2 className="text-xl font-black text-white">Novo cliente</h2>

          <div className="mt-5 space-y-4">
            <input
              className="cc-input px-4 py-3"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="cc-input px-4 py-3"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <textarea
              className="cc-input min-h-28 px-4 py-3"
              placeholder="Observacoes"
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
                className="cc-button-primary w-full px-4 py-3"
              >
                Criar cliente
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="cc-card flex items-center justify-between gap-4 rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-white">{client.name}</p>
                <p className="text-sm text-slate-400">{client.phone}</p>
              </div>

              <button
                onClick={() => handleDelete(client.id)}
                className="rounded-xl bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
              >
                Deletar
              </button>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
