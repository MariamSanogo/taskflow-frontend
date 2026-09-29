import type { Assignee } from "@/lib/types";

export function Avatar({ assignee, size = 26 }: { assignee: Assignee; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, backgroundColor: assignee.color, fontSize: size * 0.42 }}
      title={assignee.name}
    >
      {assignee.initials}
    </div>
  );
}
