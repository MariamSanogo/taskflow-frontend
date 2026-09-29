import type { Priority } from "@/lib/types";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const isUrgent = priority === "urgent";
  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold ${
        isUrgent ? "bg-danger-soft text-danger" : "bg-surface-alt text-text-2"
      }`}
    >
      {isUrgent ? "Urgent" : "Normal"}
    </span>
  );
}
