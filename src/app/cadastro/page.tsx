"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabaseClient";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    setLoading(true);

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Cadastro criado! Verifique seu email se a confirmação estiver ativa.");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6">Criar conta</h1>

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
          onClick={handleSignup}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white w-full py-3 rounded-lg font-semibold"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <p className="text-sm text-center mt-4">
          Já tem conta?{" "}
          <a href="/login" className="text-purple-600 font-semibold">
            Entrar
          </a>
        </p>
      </div>
    </div>
  );
}