"use client";

import { TasksView } from "@/components/TasksView";
import { LoadingState, ErrorState } from "@/components/PageState";
import { useProjects } from "@/lib/useProjects";

export default function TasksPage() {
  const { projects, error, refresh } = useProjects();

  if (error) return <ErrorState message={error} />;
  if (!projects) return <LoadingState label="Chargement de vos tâches..." />;

  return <TasksView projects={projects} onChange={refresh} />;
}
