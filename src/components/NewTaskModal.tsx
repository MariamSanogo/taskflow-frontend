"use client";

import { useEffect, useState } from "react";
import type { Priority, Project } from "@/lib/types";
import { CloseIcon } from "./icons";
import { createTask, fetchUsers, type Member } from "@/lib/api";

export function NewTaskModal({
  projects,
  onClose,
  onChange,
}: {
  projects: Project[];
  onClose: () => void;
  onChange: () => void;
}) {
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [members, setMembers] = useState<Member[]>([]);
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState<Priority>("normal");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((users) => {
        setMembers(users);
        setAssigneeId((current) => current || users[0]?.id || "");
      })
      .catch(() => setError("Impossible de charger les membres de l'équipe."));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !projectId || !assigneeId) return;

    setSaving(true);
    setError(null);
    try {
      await createTask({
        title: title.trim(),
        projectId,
        assigneeId,
        priority,
        dueDate: dueDate || undefined,
        description: description.trim() || undefined,
      });
      onChange();
      onClose();
    } catch {
      setError("Impossible de créer la tâche. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div
        className="w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Nouvelle tâche</h2>
          <button
            onClick={onClose}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-surface-alt text-text-2 hover:bg-border"
          >
            <CloseIcon />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-[9px] border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-[13px] font-medium text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-text/85">Titre</span>
            <input
              autoFocus
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex : Préparer la démo client"
              className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-text/85">Projet</span>
            <select
              required
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-text/85">Assigné à</span>
            <select
              required
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-text/85">Priorité</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
              >
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-text/85">Échéance</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-text/85">Description (optionnel)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-[9px] border-[1.5px] border-border px-3.5 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
            />
          </label>

          <button
            type="submit"
            disabled={saving || !title.trim() || !projectId || !assigneeId}
            className="mt-1 h-[46px] rounded-[9px] bg-accent text-[14.5px] font-bold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Création..." : "Créer la tâche"}
          </button>
        </form>
      </div>
    </div>
  );
}
