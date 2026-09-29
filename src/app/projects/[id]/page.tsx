"use client";

import { useParams } from "next/navigation";
import { ProjectView } from "@/components/ProjectView";
import { LoadingState, ErrorState } from "@/components/PageState";
import { useProjects } from "@/lib/useProjects";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { projects, error, refresh } = useProjects();

  if (error) return <ErrorState message={error} />;
  if (!projects) return <LoadingState label="Chargement du projet..." />;

  return <ProjectView projects={projects} projectId={id} onChange={refresh} />;
}
