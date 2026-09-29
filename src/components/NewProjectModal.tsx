"use client";

import { useState } from "react";
import { CloseIcon } from "./icons";
import { createProject } from "@/lib/api";

const COLORS = [
  "oklch(0.56 0.19 276)",
  "oklch(0.65 0.15 30)",
  "oklch(0.6 0.14 200)",
  "oklch(0.62 0.16 320)",
  "oklch(0.75 0.13 70)",
  "oklch(0.6 0.14 150)",
];

export function NewProjectModal({ onClose, onChange }: { onClose: () => void; onChange: () => void }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);
    try {
      await createProject(name.trim(), color);
      onChange();
      onClose();
    } catch {
      setError("Impossible de créer le projet. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6" onClick={onClose}>
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight">Nouveau projet</h2>
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
            <span className="text-[13px] font-semibold text-text/85">Nom du projet</span>
            <input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Refonte Application"
              className="h-11 rounded-[9px] border-[1.5px] border-border px-3.5 text-sm focus:border-accent focus:outline-none focus:ring-3 focus:ring-accent/15"
            />
          </label>

          <div className="flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-text/85">Couleur</span>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Choisir la couleur ${c}`}
                  className={`h-8 w-8 rounded-full ${color === c ? "ring-2 ring-offset-2 ring-accent" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="mt-1 h-[46px] rounded-[9px] bg-accent text-[14.5px] font-bold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? "Création..." : "Créer le projet"}
          </button>
        </form>
      </div>
    </div>
  );
}
