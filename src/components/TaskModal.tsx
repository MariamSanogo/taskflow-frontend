"use client";

import { useEffect, useState } from "react";
import type { Project, Task } from "@/lib/types";
import { Avatar } from "./Avatar";
import { PriorityBadge } from "./PriorityBadge";
import { CalendarIcon, CheckIcon, CloseIcon, PlusIcon, SendIcon } from "./icons";
import { currentUser } from "@/lib/mock-data";
import { addComment, addSubtask, fetchUsers, setSubtaskDone, setTaskAssignee, setTaskDone, type Member } from "@/lib/api";

export function TaskModal({
  task,
  project,
  onClose,
  onChange,
}: {
  task: Task;
  project: Project;
  onClose: () => void;
  onChange: () => void;
}) {
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [postingSubtask, setPostingSubtask] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchUsers().then(setMembers).catch(() => {});
  }, []);

  async function toggleTask() {
    await setTaskDone(task.id, !task.done);
    onChange();
  }

  async function reassign(newAssigneeId: string) {
    await setTaskAssignee(task.id, newAssigneeId);
    onChange();
  }

  async function toggleSubtask(subtaskId: string, done: boolean) {
    await setSubtaskDone(subtaskId, !done);
    onChange();
  }

  async function submitSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!subtaskTitle.trim()) return;

    setPostingSubtask(true);
    try {
      await addSubtask(task.id, subtaskTitle.trim());
      setSubtaskTitle("");
      onChange();
    } finally {
      setPostingSubtask(false);
    }
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim()) return;

    setPosting(true);
    try {
      await addComment(task.id, commentText.trim());
      setCommentText("");
      onChange();
    } finally {
      setPosting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 pb-4 pt-5.5">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
              <span className="text-[12.5px] font-semibold text-text-2">{project.name}</span>
            </div>
            <h2 className="text-lg font-extrabold leading-snug tracking-tight">{task.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="ml-3.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-surface-alt text-text-2 hover:bg-border"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto px-6 pb-5.5">
          <div className="grid grid-cols-2 gap-3.5 border-y border-border py-3.5">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold tracking-wide text-text-3">STATUT</span>
              <button
                onClick={toggleTask}
                className="w-fit rounded-md bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-soft-text hover:opacity-80"
              >
                {task.done ? "Terminée" : "En cours"} · marquer comme {task.done ? "à faire" : "terminée"}
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold tracking-wide text-text-3">PRIORITÉ</span>
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold tracking-wide text-text-3">ASSIGNÉ À</span>
              <div className="flex items-center gap-1.5">
                <Avatar assignee={task.assignee} size={22} />
                <select
                  value={task.assigneeId}
                  onChange={(e) => reassign(e.target.value)}
                  className="rounded-md border border-border bg-white px-1.5 py-0.5 text-[13px] font-medium focus:border-accent focus:outline-none"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11.5px] font-bold tracking-wide text-text-3">ÉCHÉANCE</span>
              <div className={`flex items-center gap-1.5 text-[13px] font-medium ${task.overdue ? "text-danger" : ""}`}>
                <CalendarIcon size={14} />
                {task.dueLabel}
              </div>
            </div>
          </div>

          {task.description && (
            <div className="mt-4.5">
              <span className="text-[11.5px] font-bold tracking-wide text-text-3">DESCRIPTION</span>
              <p className="mt-2 text-[13.5px] leading-relaxed">{task.description}</p>
            </div>
          )}

          <div className="mt-4.5">
            <span className="text-[11.5px] font-bold tracking-wide text-text-3">SOUS-TÂCHES</span>
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-2.5 flex flex-col gap-2.5">
                {task.subtasks.map((subtask) => (
                  <button
                    key={subtask.id}
                    onClick={() => toggleSubtask(subtask.id, subtask.done)}
                    className="flex items-center gap-2.5 text-left"
                  >
                    <div
                      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md ${
                        subtask.done ? "bg-accent" : "border-2 border-border"
                      }`}
                    >
                      {subtask.done && <CheckIcon size={11} className="text-white" />}
                    </div>
                    <span className={`text-[13.5px] ${subtask.done ? "text-text-3 line-through" : ""}`}>{subtask.title}</span>
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={submitSubtask} className="mt-3 flex items-center gap-2">
              <input
                value={subtaskTitle}
                onChange={(e) => setSubtaskTitle(e.target.value)}
                placeholder="Ajouter une sous-tâche..."
                className="h-9 flex-1 rounded-lg bg-surface-alt px-3 text-[13px] outline-none placeholder:text-text-3"
              />
              <button
                type="submit"
                disabled={postingSubtask || !subtaskTitle.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-50"
              >
                <PlusIcon size={14} className="text-white" />
              </button>
            </form>
          </div>

          <div className="mt-4.5">
            <span className="text-[11.5px] font-bold tracking-wide text-text-3">COMMENTAIRES</span>
            {task.comments && task.comments.length > 0 && (
              <div className="mt-3 flex flex-col gap-3.5">
                {task.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2.5">
                    <Avatar assignee={comment.author} />
                    <div className="flex-1">
                      <div className="mb-0.5 flex items-baseline gap-2">
                        <span className="text-[13px] font-bold">{comment.author.name}</span>
                        <span className="text-[11.5px] text-text-3">{comment.timeAgo}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-text-2">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={submitComment} className="mt-4 flex items-center gap-2.5">
              <Avatar assignee={currentUser} />
              <div className="flex h-10 flex-1 items-center rounded-lg bg-surface-alt pl-3.5 pr-1.5">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-text-3"
                />
                <button
                  type="submit"
                  disabled={posting || !commentText.trim()}
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-md bg-accent hover:bg-accent-hover disabled:opacity-50"
                >
                  <SendIcon className="text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
