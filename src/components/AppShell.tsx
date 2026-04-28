"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabaseClient } from "@/lib/supabaseClient";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clientes", label: "Clientes" },
  { href: "/pedidos", label: "Pedidos" },
  { href: "/medidas", label: "Medidas" },
  { href: "/gerar", label: "Gerar IA" },
  { href: "/designs", label: "Designs" },
  { href: "/perfil", label: "Perfil" },
];

type AppShellProps = {
  children?: ReactNode;
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export default function AppShell({
  children,
  title = "CreativeClip",
  eyebrow = "CreativeClip Studio",
  action,
}: AppShellProps) {
  const pathname = usePathname();

  async function handleLogout() {
    await supabaseClient.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.22),transparent_34%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_30%),linear-gradient(135deg,#070712_0%,#101026_48%,#180b22_100%)] text-slate-100">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-white/10 bg-black/45 px-5 py-6 backdrop-blur-2xl lg:flex lg:flex-col">
        <Link href="/dashboard" className="mb-8 block">
          <div className="text-xs font-bold uppercase tracking-[0.32em] text-pink-300">
            SaaS
          </div>
          <div className="mt-2 text-2xl font-black tracking-tight text-white">
            CreativeClip
          </div>
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-gradient-to-r from-purple-600/90 to-pink-500/90 text-white shadow-lg shadow-pink-950/30"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Workspace
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Ideias, clientes e pedidos em uma area organizada.
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
          >
            Sair
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080814]/78 px-5 py-4 backdrop-blur-2xl lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink-300">
                {eyebrow}
              </p>
              <h1 className="mt-1 text-2xl font-black tracking-tight text-white md:text-3xl">
                {title}
              </h1>
            </div>
            {action}
            <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                    pathname === item.href
                      ? "bg-pink-500 text-white"
                      : "bg-white/8 text-slate-300"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-88px)] max-w-7xl px-5 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
