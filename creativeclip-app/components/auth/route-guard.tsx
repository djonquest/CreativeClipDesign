"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/providers/app-provider";

type RouteGuardProps = {
  children: React.ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const { user, isReady } = useAppContext();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      router.replace("/login");
    }
  }, [isReady, router, user]);

  if (!isReady) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-400">
        Carregando sessão...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-sm text-slate-400">
        Redirecionando para login...
      </div>
    );
  }

  return <>{children}</>;
}
