import type { AppUser, CreationRecord } from "@/types";
import { createId } from "@/lib/utils";

const USER_KEY = "creativeclip_user";
const HISTORY_KEY = "creativeclip_history";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getStoredUser(): AppUser | null {
  if (!isBrowser()) {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AppUser;
  } catch {
    return null;
  }
}

export function setStoredUser(email: string): AppUser {
  const user: AppUser = {
    id: createId("user"),
    email,
    plan: "free",
    createdAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  return user;
}

export function clearStoredUser(): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.removeItem(USER_KEY);
}

export function getStoredHistory(): CreationRecord[] {
  if (!isBrowser()) {
    return [];
  }
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as CreationRecord[];
  } catch {
    return [];
  }
}

export function setStoredHistory(history: CreationRecord[]): void {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function appendCreation(record: CreationRecord): CreationRecord[] {
  const current = getStoredHistory();
  const updated = [record, ...current];
  setStoredHistory(updated);
  return updated;
}
