"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatCard } from "./StatCard";
import { TaskGroup } from "./TaskGroup";
import { TaskModal } from "./TaskModal";

export function Dashboard({ projects, onChange }: { projects: Project[]; onChange: () => void }) {
  const [selectedId, setSelectedId] = useState<{ taskId: string; projectId: string } | null>(null);

  const allTasks = useMemo(() => projects.flatMap((p) => p.tasks), [projects]);
  const activeCount = allTasks.filter((t) => !t.done).length;
  const overdueCount = allTasks.filter((t) => t.overdue && !t.done).length;
  const doneCount = allTasks.filter((t) => t.done).length;

  const selectedProject = selectedId ? projects.find((p) => p.id === selectedId.projectId) : undefined;
  const selectedTask = selectedProject?.tasks.find((t) => t.id === selectedId?.taskId);

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar projects={projects} onChange={onChange} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="mb-5.5">
            <h1 className="mb-1 text-[22px] font-extrabold tracking-tight">Tableau de bord</h1>
            <p className="text-[13.5px] text-text-2">Vue d&apos;ensemble de vos projets en cours</p>
          </div>

          <div className="mb-6.5 flex gap-4">
            <StatCard label="TÂCHES ACTIVES" value={activeCount} />
            <StatCard label="EN RETARD" value={overdueCount} tone="danger" />
            <StatCard label="TERMINÉES CETTE SEMAINE" value={doneCount} tone="success" />
          </div>

          {projects.map((project) => (
            <TaskGroup
              key={project.id}
              project={project}
              onTaskClick={(task) => setSelectedId({ taskId: task.id, projectId: project.id })}
              onChange={onChange}
            />
          ))}
        </div>
      </div>

      {selectedTask && selectedProject && (
        <TaskModal
          task={selectedTask}
          project={selectedProject}
          onClose={() => setSelectedId(null)}
          onChange={onChange}
        />
      )}
    </div>
  );
}
