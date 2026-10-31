import type { Task, TaskChanges } from "../../types";
import { useState } from "react";
import { EmptyState } from "../ui/EmptyState";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
  onToggle: (id: string) => void;
  onToggleChecklistItem: (id: string, itemId: string) => void;
  onEdit: (id: string, changes: TaskChanges) => void;
  onDelete: (id: string) => void;
  onReorder: (
    id: string,
    targetId: string,
    position: "before" | "after",
  ) => void;
  onSetCompleted: (ids: string[], completed: boolean) => void;
  onDeleteMany: (ids: string[]) => void;
}

export function TaskList({
  tasks,
  emptyMessage,
  onReorder,
  onSetCompleted,
  onDeleteMany,
  ...handlers
}: TaskListProps) {
  const [announcement, setAnnouncement] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (tasks.length === 0) return <EmptyState message={emptyMessage} />;

  const selectedVisibleIds = tasks
    .filter((task) => selectedIds.has(task.id))
    .map((task) => task.id);
  const allSelected = tasks.every((task) => selectedIds.has(task.id));

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(event) =>
              setSelectedIds(
                event.target.checked
                  ? new Set(tasks.map((task) => task.id))
                  : new Set(),
              )
            }
            aria-label={allSelected ? "Deselect all visible tasks" : "Select all visible tasks"}
            className="size-4 accent-primary"
          />
          Select all
        </label>
        {selectedVisibleIds.length > 0 && (
          <>
            <span className="text-sm text-muted">
              {selectedVisibleIds.length} selected
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                onSetCompleted(selectedVisibleIds, true);
                setSelectedIds(new Set());
              }}
              aria-label="Mark selected tasks complete"
              title="Mark complete"
              className="px-2"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSetCompleted(selectedVisibleIds, false);
                setSelectedIds(new Set());
              }}
              aria-label="Mark selected tasks active"
              title="Mark active"
              className="px-2"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmingDelete(true)}
              aria-label="Delete selected tasks"
              title="Delete selected"
              className="px-2"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5M14 11v5" />
              </svg>
            </Button>
          </>
        )}
      </div>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            selected={selectedIds.has(task.id)}
            onSelect={(id, selected) =>
              setSelectedIds((current) => {
                const next = new Set(current);
                if (selected) next.add(id);
                else next.delete(id);
                return next;
              })
            }
            previousTaskId={tasks[index - 1]?.id}
            nextTaskId={tasks[index + 1]?.id}
            onReorder={(id, targetId, position) => {
              const target = tasks.find((item) => item.id === targetId);
              onReorder(id, targetId, position);
              if (target) {
                setAnnouncement(
                  `Moved ${task.title} ${position} ${target.title}.`,
                );
              }
            }}
            {...handlers}
          />
        ))}
      </ul>
      {confirmingDelete && (
        <ConfirmDialog
          title="Delete selected tasks?"
          description={`Are you sure you want to delete ${selectedVisibleIds.length} selected tasks? You can undo this action briefly.`}
          confirmLabel="Delete"
          onConfirm={() => {
            onDeleteMany(selectedVisibleIds);
            setSelectedIds(new Set());
            setConfirmingDelete(false);
          }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </>
  );
}
