import type { Task, TaskChanges } from "../types";
import { nextDueDate } from "../lib/date";

export type Action =
  | { type: "add"; task: Task }
  | {
      type: "toggle";
      id: string;
      nextOccurrence?: { id: string; createdAt: number };
    }
  | {
      type: "setCompleted";
      ids: string[];
      completed: boolean;
      nextOccurrences?: Record<string, { id: string; createdAt: number }>;
    }
  | { type: "toggleChecklistItem"; id: string; itemId: string }
  | { type: "edit"; id: string; changes: TaskChanges }
  | {
      type: "reorder";
      id: string;
      targetId: string;
      position: "before" | "after";
    }
  | { type: "delete"; id: string }
  | { type: "deleteMany"; ids: string[] }
  | { type: "restore"; task: Task }
  | { type: "restoreMany"; tasks: Task[] }
  | { type: "clearCompleted" };

export function taskReducer(tasks: Task[], action: Action): Task[] {
  switch (action.type) {
    case "add":
      return [action.task, ...tasks];
    case "toggle": {
      const currentTask = tasks.find((task) => task.id === action.id);
      if (!currentTask) return tasks;

      const completed = !currentTask.completed;
      const updatedTasks = tasks.map((task) =>
        task.id === action.id ? { ...task, completed } : task,
      );
      if (
        !completed ||
        !currentTask.recurrence ||
        !action.nextOccurrence
      ) {
        return updatedTasks;
      }

      const nextTask: Task = {
        ...currentTask,
        ...action.nextOccurrence,
        completed: false,
        dueDate: currentTask.dueDate
          ? nextDueDate(currentTask.dueDate, currentTask.recurrence)
          : undefined,
        checklist: currentTask.checklist?.map((item) => ({
          ...item,
          completed: false,
        })),
      };
      return [nextTask, ...updatedTasks];
    }
    case "setCompleted": {
      const selectedIds = new Set(action.ids);
      const nextTasks: Task[] = [];
      const updatedTasks = tasks.map((task) => {
        if (!selectedIds.has(task.id) || task.completed === action.completed) {
          return task;
        }
        if (action.completed && task.recurrence && action.nextOccurrences?.[task.id]) {
          const nextTask: Task = {
            ...task,
            ...action.nextOccurrences[task.id],
            completed: false,
            dueDate: task.dueDate
              ? nextDueDate(task.dueDate, task.recurrence)
              : undefined,
            checklist: task.checklist?.map((item) => ({
              ...item,
              completed: false,
            })),
          };
          nextTasks.push(nextTask);
        }
        return { ...task, completed: action.completed };
      });
      return [...nextTasks, ...updatedTasks];
    }
    case "toggleChecklistItem":
      return tasks.map((task) =>
        task.id === action.id
          ? {
              ...task,
              checklist: (task.checklist ?? []).map((item) =>
                item.id === action.itemId
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            }
          : task,
      );
    case "edit":
      return tasks.map((t) =>
        t.id === action.id ? { ...t, ...action.changes } : t,
      );
    case "reorder": {
      const sourceIndex = tasks.findIndex((task) => task.id === action.id);
      const targetIndex = tasks.findIndex(
        (task) => task.id === action.targetId,
      );
      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return tasks;
      }

      const reordered = [...tasks];
      const [movedTask] = reordered.splice(sourceIndex, 1);
      const adjustedTargetIndex =
        targetIndex - (sourceIndex < targetIndex ? 1 : 0);
      const insertIndex =
        adjustedTargetIndex + (action.position === "after" ? 1 : 0);
      reordered.splice(insertIndex, 0, movedTask);
      return reordered;
    }
    case "delete":
      return tasks.filter((t) => t.id !== action.id);
    case "deleteMany": {
      const ids = new Set(action.ids);
      return tasks.filter((task) => !ids.has(task.id));
    }
    case "restore":
      return [...tasks, action.task].sort((a, b) => b.createdAt - a.createdAt);
    case "restoreMany":
      return [...tasks, ...action.tasks].sort((a, b) => b.createdAt - a.createdAt);
    case "clearCompleted":
      return tasks.filter((t) => !t.completed);
    default:
      return tasks;
  }
}
