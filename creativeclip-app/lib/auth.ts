import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getStoredUser, setStoredUser } from "@/lib/storage";
import type { AppUser, AuthResult } from "@/types";

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user?.email) {
      return { user: null, error: "Falha ao carregar usuário autenticado." };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        plan: "free",
        createdAt: data.user.created_at ?? new Date().toISOString(),
      },
      error: null,
    };
  }

  if (!email.includes("@") || password.length < 6) {
    return { user: null, error: "Use um e-mail válido e senha com 6+ caracteres." };
  }

  return { user: setStoredUser(email), error: null };
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user?.email) {
      return {
        user: null,
        error: "Conta criada. Verifique seu e-mail para confirmar o cadastro.",
      };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        plan: "free",
        createdAt: data.user.created_at ?? new Date().toISOString(),
      },
      error: null,
    };
  }

  if (!email.includes("@") || password.length < 6) {
    return { user: null, error: "Use um e-mail válido e senha com 6+ caracteres." };
  }

  return { user: setStoredUser(email), error: null };
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export async function getCurrentUser(): Promise<AppUser | null> {
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (!data.user?.email) {
      return null;
    }
    return {
      id: data.user.id,
      email: data.user.email,
      plan: "free",
      createdAt: data.user.created_at ?? new Date().toISOString(),
    };
  }

  return getStoredUser();
}
