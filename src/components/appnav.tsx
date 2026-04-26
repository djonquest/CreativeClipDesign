"use client";

import Link from "next/link";
import { supabaseClient } from "@/lib/supabaseClient";

export default function AppNav() {
  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <aside className="w-64 min-h-screen bg-black text-white p-5 fixed left-0 top-0">
      <h1 className="text-2xl font-bold mb-8">CreativeClip</h1>

      <nav className="space-y-3">
        <Link href="/dashboard" className="block hover:text-pink-400">
          Dashboard
        </Link>

        <Link href="/clientes" className="block hover:text-pink-400">
          Clientes
        </Link>

        <Link href="/medidas" className="block hover:text-pink-400">
          Medidas
        </Link>

        <Link href="/pedidos" className="block hover:text-pink-400">
          Pedidos
        </Link>

        <Link href="/gerar" className="block hover:text-pink-400">
          Gerar com IA
        </Link>

        <Link href="/designs" className="block hover:text-pink-400">
          Designs
        </Link>

        <Link href="/perfil" className="block hover:text-pink-400">
          Perfil
        </Link>

        <button
          onClick={handleLogout}
          className="text-red-400 pt-6 hover:text-red-300"
        >
          Sair
        </button>
      </nav>
    </aside>
  );
}