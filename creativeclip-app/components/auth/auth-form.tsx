"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn, signUp } from "@/lib/auth";
import { hasSupabaseConfig } from "@/lib/supabase/client";
import { useAppContext } from "@/components/providers/app-provider";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setUser } = useAppContext();
  const [email, setEmail] = useState("demo@creativeclip.ai");
  const [password, setPassword] = useState("creative123");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    const authFn = isLogin ? signIn : signUp;
    const { user, error } = await authFn(email, password);

    if (error) {
      setFeedback(error);
      setIsLoading(false);
      return;
    }

    if (!user) {
      setFeedback("Não foi possível carregar usuário no momento.");
      setIsLoading(false);
      return;
    }

    setUser(user);
    setIsLoading(false);
    router.push("/dashboard");
  }

  return (
    <Card className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-white">
          {isLogin ? "Entrar no CreativeClip" : "Criar conta"}
        </h1>
        <p className="text-sm text-slate-400">
          {isLogin
            ? "Acesse seu hub para gerar imagens 3D de moda com IA."
            : "Comece em minutos com o plano gratuito."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-slate-300">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-slate-300">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        {feedback ? (
          <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
            {feedback}
          </p>
        ) : null}

        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLogin ? "Entrar" : "Cadastrar"}
        </Button>
      </form>

      <p className="text-xs text-slate-400">
        {isLogin ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
        <Link
          href={isLogin ? "/cadastro" : "/login"}
          className="font-semibold text-violet-300 hover:text-violet-200"
        >
          {isLogin ? "Criar agora" : "Fazer login"}
        </Link>
      </p>

      {!hasSupabaseConfig() ? (
        <p className="rounded-lg border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100">
          Modo demo ativo: configure `NEXT_PUBLIC_SUPABASE_URL` e
          `NEXT_PUBLIC_SUPABASE_ANON_KEY` para autenticação real.
        </p>
      ) : null}
    </Card>
  );
}
