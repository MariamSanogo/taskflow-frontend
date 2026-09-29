import type { Project, Task } from "@/lib/types";
import { TaskRow } from "./TaskRow";

export function TaskGroup({
  project,
  onTaskClick,
  onChange,
}: {
  project: Project;
  onTaskClick: (task: Task) => void;
  onChange: () => void;
}) {
  return (
    <div className="mb-4.5 overflow-hidden rounded-xl border border-border bg-white last:mb-0">
      <div className="flex items-center gap-2.5 border-b border-border px-4.5 py-3.5">
        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: project.color }} />
        <span className="text-sm font-bold">{project.name}</span>
        <span className="text-[12.5px] text-text-3">{project.tasks.length} tâches</span>
      </div>
      {project.tasks.map((task) => (
        <TaskRow key={task.id} task={task} onClick={() => onTaskClick(task)} onChange={onChange} />
      ))}
    </div>
  );
}
