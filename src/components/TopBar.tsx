import { Avatar } from "./Avatar";
import { BellIcon, SearchIcon } from "./icons";
import { currentUser } from "@/lib/mock-data";

export function TopBar() {
  return (
    <div className="flex h-[68px] shrink-0 items-center justify-between border-b border-border px-8">
      <div className="flex h-[38px] w-[340px] items-center gap-2.5 rounded-lg bg-surface-alt px-3.5">
        <SearchIcon className="text-text-3" />
        <span className="text-[13.5px] text-text-3">Rechercher une tâche, un projet...</span>
      </div>
      <div className="flex items-center gap-4.5">
        <div className="relative">
          <BellIcon className="text-text-2" />
          <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border-[1.5px] border-white bg-danger" />
        </div>
        <div className="h-6 w-px bg-border" />
        <Avatar assignee={currentUser} size={34} />
      </div>
    </div>
  );
}
