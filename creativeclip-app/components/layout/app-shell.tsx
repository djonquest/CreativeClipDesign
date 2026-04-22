"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/components/providers/app-provider";
import { Logo } from "@/components/layout/logo";
import { MobileAppNav } from "@/components/layout/mobile-app-nav";
import { cn } from "@/lib/utils";

const appLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gerar", label: "Gerar IA" },
  { href: "/historico", label: "Histórico" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAppContext();

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 p-1 md:flex">
            {appLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <Badge>{user?.plan?.toUpperCase() ?? "FREE"}</Badge>
            <Button variant="ghost" onClick={signOut} className="px-3 py-2">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 pt-8">
        <section className="rounded-2xl border border-white/10 bg-slate-900/50 px-5 py-4">
          <p className="text-sm text-slate-200">
            Conta conectada:{" "}
            <span className="font-semibold text-white">{user?.email ?? "visitante"}</span>
          </p>
          <p className="text-xs text-slate-400">
            Navegue pelo hub para gerar visuais de moda em 3D com IA.
          </p>
        </section>
        {children}
      </main>
      <MobileAppNav />
    </div>
  );
}
