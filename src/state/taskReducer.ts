import type { Task, TaskChanges } from "../types";

export type Action =
  | { type: "add"; task: Task }
  | { type: "toggle"; id: string }
  | { type: "edit"; id: string; changes: TaskChanges }
  | { type: "delete"; id: string }
  | { type: "restore"; task: Task }
  | { type: "clearCompleted" };

export function taskReducer(tasks: Task[], action: Action): Task[] {
  switch (action.type) {
    case "add":
      return [action.task, ...tasks];
    case "toggle":
      return tasks.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t,
      );
    case "edit":
      return tasks.map((t) =>
        t.id === action.id ? { ...t, ...action.changes } : t,
      );
    case "delete":
      return tasks.filter((t) => t.id !== action.id);
    case "restore":
      return [...tasks, action.task].sort((a, b) => b.createdAt - a.createdAt);
    case "clearCompleted":
      return tasks.filter((t) => !t.completed);
    default:
      return tasks;
  }
}
