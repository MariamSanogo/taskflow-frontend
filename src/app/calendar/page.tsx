"use client";

import { CalendarView } from "@/components/CalendarView";
import { LoadingState, ErrorState } from "@/components/PageState";
import { useProjects } from "@/lib/useProjects";

export default function CalendarPage() {
  const { projects, error, refresh } = useProjects();

  if (error) return <ErrorState message={error} />;
  if (!projects) return <LoadingState label="Chargement du calendrier..." />;

  return <CalendarView projects={projects} onChange={refresh} />;
}
