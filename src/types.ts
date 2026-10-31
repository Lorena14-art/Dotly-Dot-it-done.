export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // "YYYY-MM-DD"
  completed: boolean;
  createdAt: number;
  priority: Priority;
  tags?: string[];
}

export type NewTaskInput = {
  title: string;
  priority: Priority;
  description?: string;
  dueDate?: string;
  tags?: string[];
};

export type TaskChanges = Partial<
  Pick<Task, "title" | "description" | "dueDate" | "tags">
>;