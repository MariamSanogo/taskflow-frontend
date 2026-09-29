import type { Task } from "@/lib/types";
import { Avatar } from "./Avatar";
import { PriorityBadge } from "./PriorityBadge";
import { CalendarIcon, CheckIcon } from "./icons";
import { setTaskDone } from "@/lib/api";

export function TaskRow({ task, onClick, onChange }: { task: Task; onClick: () => void; onChange: () => void }) {
  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();
    await setTaskDone(task.id, !task.done);
    onChange();
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3.5 border-b border-border px-4.5 py-3 text-left last:border-b-0 hover:bg-surface-alt/40"
    >
      <div
        onClick={toggle}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          task.done ? "bg-accent" : "border-2 border-border"
        }`}
      >
        {task.done && <CheckIcon size={12} className="text-white" />}
      </div>
      <span className={`flex-1 truncate text-sm ${task.done ? "text-text-3 line-through" : "font-medium"}`}>
        {task.title}
      </span>
      <PriorityBadge priority={task.priority} />
      <div className={`flex w-[92px] shrink-0 items-center gap-1.5 text-[12.5px] ${task.overdue ? "font-semibold text-danger" : "text-text-3"}`}>
        <CalendarIcon />
        {task.dueLabel}
      </div>
      <Avatar assignee={task.assignee} />
    </button>
  );
}
