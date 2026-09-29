export type Priority = "urgent" | "normal";

export interface Assignee {
  name: string;
  initials: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

export interface TaskComment {
  id: string;
  author: Assignee;
  text: string;
  timeAgo: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueLabel: string;
  dueDate?: string | null;
  overdue?: boolean;
  assignee: Assignee;
  assigneeId: string;
  description?: string;
  subtasks?: Subtask[];
  comments?: TaskComment[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}
