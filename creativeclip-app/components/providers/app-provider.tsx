"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut as signOutAction } from "@/lib/auth";
import { demoCreations } from "@/lib/mock-data";
import { clearStoredUser, getStoredHistory, getStoredUser } from "@/lib/storage";
import type { AppUser, CreationRecord } from "@/types";

type AppContextValue = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  history: CreationRecord[];
  setHistory: (history: CreationRecord[]) => void;
  isReady: boolean;
  signOut: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [history, setHistory] = useState<CreationRecord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateClientState() {
      const resolvedUser = await getCurrentUser();
      const fallbackStoredUser = getStoredUser();
      const storedHistory = getStoredHistory();

      if (!isMounted) {
        return;
      }

      setUser(resolvedUser ?? fallbackStoredUser);
      setHistory(storedHistory.length > 0 ? storedHistory : demoCreations);
      setIsReady(true);
    }

    hydrateClientState();

    return () => {
      isMounted = false;
    };
  }, []);

  const signOut = useCallback(async () => {
    await signOutAction();
    clearStoredUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      history,
      setHistory,
      isReady,
      signOut,
    }),
    [history, isReady, signOut, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
