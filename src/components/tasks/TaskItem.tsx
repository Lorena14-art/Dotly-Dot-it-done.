import { useState } from "react";
import type { DragEvent, KeyboardEvent } from "react";
import type { Task, TaskChanges } from "../../types";
import { isOverdue } from "../../lib/date";
import { Button } from "../ui/Button";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import { DotCheckbox } from "../ui/DotCheckbox";
import { PriorityDot } from "../ui/PriorityDot";
import { DueDate } from "./DueDate";
import { TaskEditForm } from "./TaskEditForm";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  selectionMode: boolean;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onToggleChecklistItem: (id: string, itemId: string) => void;
  onEdit: (id: string, changes: TaskChanges) => void;
  onDelete: (id: string) => void;
  onReorder: (
    id: string,
    targetId: string,
    position: "before" | "after",
  ) => void;
  previousTaskId?: string;
  nextTaskId?: string;
}

export function TaskItem({
  task,
  onToggle,
  selectionMode,
  selected,
  onSelect,
  onToggleChecklistItem,
  onEdit,
  onDelete,
  onReorder,
  previousTaskId,
  nextTaskId,
}: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const overdue = isOverdue(task.dueDate, task.completed);

  function handleReorderKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowUp" && previousTaskId) {
      event.preventDefault();
      onReorder(task.id, previousTaskId, "before");
    } else if (event.key === "ArrowDown" && nextTaskId) {
      event.preventDefault();
      onReorder(task.id, nextTaskId, "after");
    }
  }

  function handleDrop(event: DragEvent<HTMLLIElement>) {
    event.preventDefault();
    setIsDropTarget(false);
    const draggedTaskId = event.dataTransfer.getData("text/plain");
    if (draggedTaskId && draggedTaskId !== task.id) {
      onReorder(draggedTaskId, task.id, "before");
    }
  }

  return (
    <li
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDragEnter={() => setIsDropTarget(true)}
      onDragLeave={() => setIsDropTarget(false)}
      onDrop={handleDrop}
      className={`grid min-w-0 ${
        selectionMode
          ? "grid-cols-[auto_auto_minmax(0,1fr)] sm:grid-cols-[auto_auto_minmax(0,1fr)_auto]"
          : "grid-cols-[auto_minmax(0,1fr)] sm:grid-cols-[auto_minmax(0,1fr)_auto]"
      } items-start gap-2 rounded-2xl border bg-surface p-3 sm:gap-3 sm:px-4 sm:py-3 ${
        selected ? "ring-1 ring-primary" : ""
      } ${
        isDropTarget ? "border-primary" : "border-border"
      } ${isDragging ? "opacity-50" : ""}`}
    >
      {selectionMode && (
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) => onSelect(task.id, event.target.checked)}
          aria-label={`Select "${task.title}" for bulk actions`}
          className="mt-1 size-4 shrink-0 accent-primary"
        />
      )}
      <div className="pt-0.5">
        <DotCheckbox
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          label={`Mark "${task.title}" as ${task.completed ? "active" : "done"}`}
        />
      </div>

      {editing ? (
        <TaskEditForm
          task={task}
          onSave={(changes) => {
            onEdit(task.id, changes);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div
            className="min-w-0"
            onDoubleClick={() => setEditing(true)}
          >
            <div className="flex items-center gap-2">
              <PriorityDot priority={task.priority} />
              <span
                className={`[overflow-wrap:anywhere] ${
                  task.completed ? "text-muted line-through" : ""
                }`}
              >
                {task.title}
              </span>
            </div>
            {task.description && (
              <p className="mt-1 text-sm whitespace-pre-wrap text-muted [overflow-wrap:anywhere]">
                {task.description}
              </p>
            )}
            {task.tags && task.tags.length > 0 && (
              <ul aria-label="Tags" className="mt-2 flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-semibold text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
            {task.checklist && task.checklist.length > 0 && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted">
                  Checklist (
                  {task.checklist.filter((item) => item.completed).length}/
                  {task.checklist.length})
                </p>
                <ul className="space-y-1">
                  {task.checklist.map((item) => (
                    <li key={item.id}>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() =>
                            onToggleChecklistItem(task.id, item.id)
                          }
                          aria-label={`${item.completed ? "Mark incomplete" : "Complete"} checklist item: ${item.text}`}
                          className="size-4 shrink-0 accent-primary"
                        />
                        <span
                          className={
                            item.completed
                              ? "text-muted line-through"
                              : "text-fg"
                          }
                        >
                          {item.text}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {task.dueDate && <DueDate date={task.dueDate} overdue={overdue} />}
            {task.recurrence && (
              <p className="mt-2 text-xs font-semibold text-muted">
                Repeats {task.recurrence}
              </p>
            )}
          </div>

          <div
            className={`flex justify-end gap-1 ${
              selectionMode
                ? "col-span-3 sm:col-start-4"
                : "col-span-2 sm:col-start-3"
            } sm:col-span-1 sm:row-start-1`}
          >
            <Button
              variant="ghost"
              onClick={() => setEditing(true)}
              aria-label={`Edit "${task.title}"`}
              title="Edit task"
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
              </svg>
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Delete "${task.title}"`}
              title="Delete task"
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
            <button
              type="button"
              draggable
              aria-label={`Reorder "${task.title}". Use up and down arrow keys to move.`}
              title="Drag to reorder, or use arrow keys"
              onKeyDown={handleReorderKey}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", task.id);
                setIsDragging(true);
              }}
              onDragEnd={() => {
                setIsDragging(false);
                setIsDropTarget(false);
              }}
              className="inline-flex size-9 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg border border-border bg-surface-alt text-primary hover:border-primary active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-primary"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 14C17.4477 14 17 14.4477 17 15C17 15.5523 17.4477 16 18 16C18.5523 16 19 15.5523 19 15C19 14.4477 18.5523 14 18 14Z" />
                <path d="M12 14C11.4477 14 11 14.4477 11 15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15C13 14.4477 12.5523 14 12 14Z" />
                <path d="M6 14C5.44772 14 5 14.4477 5 15C5 15.5523 5.44772 16 6 16C6.55228 16 7 15.5523 7 15C7 14.4477 6.55228 14 6 14Z" />
                <path d="M18 8C17.4477 8 17 8.44772 17 9C17 9.55228 17.4477 10 18 10C18.5523 10 19 9.55228 19 9C19 8.44772 18.5523 8 18 8Z" />
                <path d="M12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10C12.5523 10 13 9.55228 13 9C13 8.44772 12.5523 8 12 8Z" />
                <path d="M6 8C5.44772 8 5 8.44772 5 9C5 9.55228 5.44772 10 6 10C6.55228 10 7 9.55228 7 9C7 8.44772 6.55228 8 6 8Z" />
              </svg>
            </button>
          </div>
        </>
      )}
      {confirmingDelete && (
        <ConfirmDialog
          title="Delete task?"
          description={`Are you sure you want to delete "${task.title}"? You can undo this action briefly.`}
          confirmLabel="Delete"
          onConfirm={() => {
            onDelete(task.id);
            setConfirmingDelete(false);
          }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </li>
  );
}
