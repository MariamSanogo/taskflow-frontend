import type { Project, Task, TaskComment, Subtask, Assignee, Priority } from "./types";

interface ApiUser {
  id: number;
  name: string;
  initials: string;
  color: string;
}

interface ApiComment {
  id: number;
  text: string;
  createdAt: string;
  author: ApiUser;
}

interface ApiSubtask {
  id: number;
  title: string;
  done: boolean;
}

interface ApiTask {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate: string | null;
  description: string | null;
  assignee: ApiUser;
  subtasks: ApiSubtask[];
  comments: ApiComment[];
}

interface ApiProject {
  id: number;
  name: string;
  color: string;
  tasks: ApiTask[];
}

function toAssignee(user: ApiUser): Assignee {
  return { name: user.name, initials: user.initials, color: user.color };
}

function formatDueLabel(dueDate: string | null): string {
  if (!dueDate) return "";
  return new Date(dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function formatTimeAgo(createdAt: string): string {
  const hours = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "à l'instant";
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

function toTask(task: ApiTask): Task {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;

  const subtasks: Subtask[] = task.subtasks.map((s) => ({
    id: String(s.id),
    title: s.title,
    done: s.done,
  }));

  const comments: TaskComment[] = task.comments.map((c) => ({
    id: String(c.id),
    author: toAssignee(c.author),
    text: c.text,
    timeAgo: formatTimeAgo(c.createdAt),
  }));

  return {
    id: String(task.id),
    title: task.title,
    done: task.done,
    priority: task.priority,
    dueLabel: formatDueLabel(task.dueDate),
    dueDate: task.dueDate,
    overdue: dueDate ? dueDate.getTime() < Date.now() && !task.done : false,
    assignee: toAssignee(task.assignee),
    assigneeId: String(task.assignee.id),
    description: task.description ?? undefined,
    subtasks,
    comments,
  };
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export async function setTaskDone(taskId: string, done: boolean): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ done }),
  });
  if (!res.ok) throw new Error("Impossible de mettre à jour la tâche");
}

export async function setSubtaskDone(subtaskId: string, done: boolean): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/subtasks/${subtaskId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ done }),
  });
  if (!res.ok) throw new Error("Impossible de mettre à jour la sous-tâche");
}

export interface Member {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export async function fetchUsers(): Promise<Member[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Impossible de charger les membres");

  const data: ApiUser[] = await res.json();
  return data.map((u) => ({ id: String(u.id), name: u.name, initials: u.initials, color: u.color }));
}

export async function setTaskAssignee(taskId: string, assigneeId: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ assigneeId }),
  });
  if (!res.ok) throw new Error("Impossible de réassigner la tâche");
}

export async function createTask(data: {
  title: string;
  projectId: string;
  assigneeId: string;
  priority: Priority;
  dueDate?: string;
  description?: string;
}): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Impossible de créer la tâche");
}

export async function addSubtask(taskId: string, title: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/subtasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Impossible d'ajouter la sous-tâche");
}

export async function addComment(taskId: string, text: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("Impossible d'ajouter le commentaire");
}

export async function createProject(name: string, color: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, color }),
  });
  if (!res.ok) throw new Error("Impossible de créer le projet");
}

export async function fetchProjects(): Promise<Project[]> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    throw new Error("Impossible de charger les projets");
  }

  const data: ApiProject[] = await res.json();

  return data.map((project) => ({
    id: String(project.id),
    name: project.name,
    color: project.color,
    tasks: project.tasks.map(toTask),
  }));
}
