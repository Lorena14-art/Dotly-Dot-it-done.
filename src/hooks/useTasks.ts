import { useCallback, useMemo, useState } from "react";
import { taskReducer, type Action } from "../state/taskReducer";
import { useLocalStorage } from "./useLocalStorage";
import type { Filter, NewTaskInput, Task, TaskChanges } from "../types";

type TaskSort = "newest" | "oldest" | "title";

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("dotly:tasks", []);
  const [filter, setFilter] = useState<Filter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<TaskSort>("newest");
  const [tagFilter, setTagFilter] = useState("all");
  const [lastDeleted, setLastDeleted] = useState<Task | null>(null);

  // Reducer logic + localStorage persistence in one place
  const dispatch = useCallback(
    (action: Action) => setTasks((prev) => taskReducer(prev, action)),
    [setTasks],
  );

  const addTask = (input: NewTaskInput) =>
    dispatch({
      type: "add",
      task: {
        id: crypto.randomUUID(),
        completed: false,
        createdAt: Date.now(),
        ...input,
      },
    });
  const toggleTask = (id: string) => dispatch({ type: "toggle", id });
  const editTask = (id: string, changes: TaskChanges) =>
    dispatch({ type: "edit", id, changes });
  const clearCompleted = () => dispatch({ type: "clearCompleted" });

  const deleteTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) setLastDeleted(task); // remember it for Undo
    dispatch({ type: "delete", id });
  };

  const undoDelete = useCallback(() => {
    if (!lastDeleted) return;
    dispatch({ type: "restore", task: lastDeleted });
    setLastDeleted(null);
  }, [dispatch, lastDeleted]);

  const dismissUndo = useCallback(() => setLastDeleted(null), []);

  const availableTags = useMemo(() => {
    const tags = new Map<string, string>();
    for (const task of tasks) {
      for (const tag of task.tags ?? []) {
        const key = tag.toLocaleLowerCase();
        if (!tags.has(key)) tags.set(key, tag);
      }
    }
    if (tagFilter !== "all" && !tags.has(tagFilter.toLocaleLowerCase())) {
      tags.set(tagFilter.toLocaleLowerCase(), tagFilter);
    }
    return [...tags.values()].sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
  }, [tasks, tagFilter]);

  const visibleTasks = useMemo(() => {
      const query = searchTerm.trim().toLowerCase();
      const filtered = tasks.filter((task) => {
        const matchesFilter =
          filter === "all"
            ? true
            : filter === "active"
              ? !task.completed
              : task.completed;
        const matchesTag =
          tagFilter === "all" ||
          (task.tags ?? []).some(
            (tag) => tag.toLowerCase() === tagFilter.toLowerCase(),
          );
        return (
          matchesFilter &&
          matchesTag &&
          (!query || task.title.toLowerCase().includes(query))
        );
      });
      return filtered.sort((a, b) => {
        if (sort === "title") {
          return a.title.localeCompare(b.title, undefined, {
            sensitivity: "base",
          });
        }
        return sort === "newest"
          ? b.createdAt - a.createdAt
          : a.createdAt - b.createdAt;
      });
  }, [tasks, filter, searchTerm, sort, tagFilter]);

  const remaining = tasks.filter((t) => !t.completed).length;

  return {
    tasks: visibleTasks,
    totalCount: tasks.length,
    remaining,
    hasCompleted: tasks.length - remaining > 0,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sort,
    setSort,
    tagFilter,
    setTagFilter,
    availableTags,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    clearCompleted,
    lastDeleted,
    undoDelete,
    dismissUndo,
  };
}
