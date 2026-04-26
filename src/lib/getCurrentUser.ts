import { supabaseClient } from "./supabaseClient";

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}