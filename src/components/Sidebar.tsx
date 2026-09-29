"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Project } from "@/lib/types";
import { Avatar } from "./Avatar";
import { CalendarNavIcon, ChevronDownIcon, DashboardIcon, PlusIcon, TasksIcon } from "./icons";
import { currentUser } from "@/lib/mock-data";
import { NewTaskModal } from "./NewTaskModal";
import { NewProjectModal } from "./NewProjectModal";

export function Sidebar({ projects, onChange }: { projects: Project[]; onChange: () => void }) {
  const pathname = usePathname();
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  return (
    <div className="flex w-[264px] shrink-0 flex-col border-r border-border bg-surface p-4">
      <div className="flex items-center gap-2.5 px-2 pb-6 pt-1">
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-accent text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 13l4.5 4.5L19 7.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-base font-bold tracking-tight">TaskFlow</span>
      </div>

      <button
        onClick={() => setShowNewTask(true)}
        className="mb-5 flex h-[38px] items-center justify-center gap-2 rounded-lg bg-accent text-[13.5px] font-bold text-white hover:bg-accent-hover"
      >
        <PlusIcon size={15} />
        Nouvelle tâche
      </button>

      <nav className="mb-5 flex flex-col gap-0.5">
        {[
          { href: "/", label: "Tableau de bord", icon: DashboardIcon },
          { href: "/tasks", label: "Mes tâches", icon: TasksIcon },
          { href: "/calendar", label: "Calendrier", icon: CalendarNavIcon },
        ].map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive ? "bg-accent-soft font-semibold text-accent-soft-text" : "text-text-2"
              }`}
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mb-2 flex items-center justify-between px-3">
        <span className="text-[11.5px] font-bold tracking-wide text-text-3">ÉQUIPES</span>
        <button
          onClick={() => setShowNewProject(true)}
          aria-label="Nouveau projet"
          className="flex h-5 w-5 items-center justify-center rounded text-text-3 hover:bg-surface-alt hover:text-text"
        >
          <PlusIcon size={12} />
        </button>
      </div>
      <div className="flex flex-col gap-px">
        {projects.map((project) => {
          const href = `/projects/${project.id}`;
          const isActive = pathname === href;
          return (
            <Link
              key={project.id}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium ${
                isActive ? "bg-accent-soft font-semibold text-accent-soft-text" : ""
              }`}
            >
              <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: project.color }} />
              <span className="flex-1 truncate">{project.name}</span>
              <span className="text-xs text-text-3">{project.tasks.length}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="mt-2 flex items-center gap-2.5 border-t border-border px-2 pt-3">
        <Avatar assignee={currentUser} size={32} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold">{currentUser.name}</div>
          <div className="text-xs text-text-3">Cheffe de projet</div>
        </div>
        <ChevronDownIcon className="shrink-0 text-text-3" />
      </div>

      {showNewTask && (
        <NewTaskModal projects={projects} onClose={() => setShowNewTask(false)} onChange={onChange} />
      )}
      {showNewProject && (
        <NewProjectModal onClose={() => setShowNewProject(false)} onChange={onChange} />
      )}
    </div>
  );
}
