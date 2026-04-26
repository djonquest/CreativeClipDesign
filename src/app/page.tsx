"use client";

import { useEffect } from "react";
import { getCurrentUser } from "@/lib/getCurrentUser";

export default function HomePage() {
  useEffect(() => {
    async function checkUser() {
      const user = await getCurrentUser();

      if (user) {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/site";
      }
    }

    checkUser();
  }, []);

  return <p className="p-6">Carregando...</p>;
}