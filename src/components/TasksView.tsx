"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { TaskGroup } from "./TaskGroup";
import { TaskModal } from "./TaskModal";

type Filter = "all" | "active" | "done";

export function TasksView({ projects, onChange }: { projects: Project[]; onChange: () => void }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<{ taskId: string; projectId: string } | null>(null);

  const filteredProjects = useMemo(() => {
    return projects
      .map((project) => ({
        ...project,
        tasks: project.tasks.filter((task) => {
          if (filter === "active") return !task.done;
          if (filter === "done") return task.done;
          return true;
        }),
      }))
      .filter((project) => project.tasks.length > 0);
  }, [projects, filter]);

  const selectedProject = selectedId ? projects.find((p) => p.id === selectedId.projectId) : undefined;
  const selectedTask = selectedProject?.tasks.find((t) => t.id === selectedId?.taskId);

  const tabs: { key: Filter; label: string }[] = [
    { key: "all", label: "Toutes" },
    { key: "active", label: "Actives" },
    { key: "done", label: "Terminées" },
  ];

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar projects={projects} onChange={onChange} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="mb-5.5">
            <h1 className="mb-1 text-[22px] font-extrabold tracking-tight">Mes tâches</h1>
            <p className="text-[13.5px] text-text-2">Toutes vos tâches, tous projets confondus</p>
          </div>

          <div className="mb-6.5 flex gap-1 rounded-[10px] bg-surface-alt p-1" style={{ width: "fit-content" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`rounded-[7px] px-4 py-2 text-sm font-semibold ${
                  filter === tab.key ? "bg-white text-text shadow-sm" : "text-text-2"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <p className="text-sm text-text-2">Aucune tâche dans cette catégorie.</p>
          ) : (
            filteredProjects.map((project) => (
              <TaskGroup
                key={project.id}
                project={project}
                onTaskClick={(task) => setSelectedId({ taskId: task.id, projectId: project.id })}
                onChange={onChange}
              />
            ))
          )}
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
