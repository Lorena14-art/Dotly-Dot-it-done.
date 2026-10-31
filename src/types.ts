export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";
export type Recurrence = "daily" | "weekly" | "monthly" | "yearly";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // "YYYY-MM-DD"
  completed: boolean;
  createdAt: number;
  priority: Priority;
  tags?: string[];
  checklist?: ChecklistItem[];
  recurrence?: Recurrence;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export type NewTaskInput = {
  title: string;
  priority: Priority;
  description?: string;
  dueDate?: string;
  tags?: string[];
  checklist?: ChecklistItem[];
  recurrence?: Recurrence;
};

export type TaskChanges = Partial<
  Pick<
    Task,
    | "title"
    | "description"
    | "dueDate"
    | "priority"
    | "tags"
    | "checklist"
    | "recurrence"
  >
>;