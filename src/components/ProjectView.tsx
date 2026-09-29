"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { StatCard } from "./StatCard";
import { TaskGroup } from "./TaskGroup";
import { TaskModal } from "./TaskModal";

export function ProjectView({
  projects,
  projectId,
  onChange,
}: {
  projects: Project[];
  projectId: string;
  onChange: () => void;
}) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const project = projects.find((p) => p.id === projectId);
  const selectedTask = project?.tasks.find((t) => t.id === selectedTaskId);

  const activeCount = project ? project.tasks.filter((t) => !t.done).length : 0;
  const overdueCount = project ? project.tasks.filter((t) => t.overdue && !t.done).length : 0;
  const doneCount = project ? project.tasks.filter((t) => t.done).length : 0;

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar projects={projects} onChange={onChange} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-8 py-7">
          {!project ? (
            <p className="text-sm text-text-2">Projet introuvable.</p>
          ) : (
            <>
              <div className="mb-5.5">
                <h1 className="mb-1 text-[22px] font-extrabold tracking-tight">{project.name}</h1>
                <p className="text-[13.5px] text-text-2">Vue d&apos;ensemble de ce projet</p>
              </div>

              <div className="mb-6.5 flex gap-4">
                <StatCard label="TÂCHES ACTIVES" value={activeCount} />
                <StatCard label="EN RETARD" value={overdueCount} tone="danger" />
                <StatCard label="TERMINÉES" value={doneCount} tone="success" />
              </div>

              <TaskGroup
                project={project}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
                onChange={onChange}
              />
            </>
          )}
        </div>
      </div>

      {selectedTask && project && (
        <TaskModal
          task={selectedTask}
          project={project}
          onClose={() => setSelectedTaskId(null)}
          onChange={onChange}
        />
      )}
    </div>
  );
}
