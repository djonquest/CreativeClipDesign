"use client";

import { useEffect, useState } from "react";

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
    const res = await fetch(`/api/clients?userId=${userId}`);
    const data = await res.json();
    setClients(data);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleCreate() {
    await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({ name, phone, notes, userId }),
    });

    setName("");
    setPhone("");
    setNotes("");
    fetchClients();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/clients?id=${id}`, {
      method: "DELETE",
    });

    fetchClients();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <div className="mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Observações"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2"
        >
          Criar Cliente
        </button>
      </div>

      <div className="space-y-3">
        {clients.map((client) => (
          <div key={client.id} className="border p-3 flex justify-between">
            <div>
              <p className="font-bold">{client.name}</p>
              <p>{client.phone}</p>
            </div>

            <button
              onClick={() => handleDelete(client.id)}
              className="text-red-500"
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}