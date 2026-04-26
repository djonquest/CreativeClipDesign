"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/perfil";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6">Entrar</h1>

        <input
          className="border p-3 w-full rounded mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-3 w-full rounded mb-4"
          placeholder="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-full py-3 rounded-lg font-semibold"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="text-sm text-center mt-4">
          Não tem conta?{" "}
          <a href="/cadastro" className="text-purple-600 font-semibold">
            Criar conta
          </a>
        </p>
      </div>
    </div>
  );
}