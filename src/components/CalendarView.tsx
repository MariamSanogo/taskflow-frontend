"use client";

import { useMemo, useState } from "react";
import type { Project, Task } from "@/lib/types";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { TaskModal } from "./TaskModal";

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Construit une grille de 42 jours (6 semaines) débutant un lundi, couvrant le mois demandé
function buildGrid(monthStart: Date): Date[] {
  const firstWeekday = (monthStart.getDay() + 6) % 7; // 0 = lundi
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

export function CalendarView({ projects, onChange }: { projects: Project[]; onChange: () => void }) {
  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));
  const [selectedId, setSelectedId] = useState<{ taskId: string; projectId: string } | null>(null);

  const selectedProject = selectedId ? projects.find((p) => p.id === selectedId.projectId) : undefined;
  const selectedTask = selectedProject?.tasks.find((t) => t.id === selectedId?.taskId);

  const tasksByDay = useMemo(() => {
    const map = new Map<string, { task: Task; project: Project }[]>();
    for (const project of projects) {
      for (const task of project.tasks) {
        if (!task.dueDate) continue;
        const key = task.dueDate.slice(0, 10); // "YYYY-MM-DD"
        const list = map.get(key) ?? [];
        list.push({ task, project });
        map.set(key, list);
      }
    }
    return map;
  }, [projects]);

  const grid = useMemo(() => buildGrid(monthStart), [monthStart]);
  const today = new Date();

  function goToMonth(offset: number) {
    setMonthStart((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar projects={projects} onChange={onChange} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <div className="flex-1 overflow-y-auto px-8 py-7">
          <div className="mb-5.5 flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-[22px] font-extrabold tracking-tight">Calendrier</h1>
              <p className="text-[13.5px] text-text-2">
                {MONTHS[monthStart.getMonth()]} {monthStart.getFullYear()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMonthStart(startOfMonth(new Date()))}
                className="rounded-[8px] border border-border px-3 py-1.5 text-[13px] font-semibold text-text-2 hover:bg-surface-alt"
              >
                Aujourd&apos;hui
              </button>
              <button
                onClick={() => goToMonth(-1)}
                aria-label="Mois précédent"
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border text-text-2 hover:bg-surface-alt"
              >
                ‹
              </button>
              <button
                onClick={() => goToMonth(1)}
                aria-label="Mois suivant"
                className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-border text-text-2 hover:bg-surface-alt"
              >
                ›
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <div className="grid grid-cols-7 border-b border-border">
              {WEEKDAYS.map((day) => (
                <div key={day} className="px-3 py-2.5 text-center text-[12px] font-bold text-text-3">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {grid.map((day, i) => {
                const inMonth = day.getMonth() === monthStart.getMonth();
                const isToday = sameDay(day, today);
                const key = day.toISOString().slice(0, 10);
                const dayTasks = tasksByDay.get(key) ?? [];

                return (
                  <div
                    key={i}
                    className={`min-h-[104px] border-b border-r border-border p-2 last:border-r-0 ${
                      inMonth ? "" : "bg-surface-alt/40"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[12.5px] font-semibold ${
                        isToday ? "bg-accent text-white" : inMonth ? "text-text" : "text-text-3"
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    <div className="mt-1.5 flex flex-col gap-1">
                      {dayTasks.slice(0, 3).map(({ task, project }) => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedId({ taskId: task.id, projectId: project.id })}
                          className="truncate rounded-[5px] px-1.5 py-0.5 text-left text-[11.5px] font-medium text-white"
                          style={{ backgroundColor: project.color }}
                          title={task.title}
                        >
                          {task.title}
                        </button>
                      ))}
                      {dayTasks.length > 3 && (
                        <span className="px-1.5 text-[11px] text-text-3">+{dayTasks.length - 3} autres</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
