"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProjects } from "./api";
import type { Project } from "./types";

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchProjects()
      .then(setProjects)
      .catch((err) => {
        if (err instanceof Error && err.message === "UNAUTHORIZED") {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        setError("Impossible de charger vos projets. Réessayez plus tard.");
      });
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return { projects, error, refresh: load };
}
