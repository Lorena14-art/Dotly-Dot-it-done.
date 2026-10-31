import { useState } from "react";
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
  onEdit: (id: string, changes: TaskChanges) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const overdue = isOverdue(task.dueDate, task.completed);

  return (
    <li className="flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
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
            className="min-w-0 flex-1"
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
            {task.dueDate && <DueDate date={task.dueDate} overdue={overdue} />}
          </div>

          <div className="flex shrink-0 gap-1">
            <Button
              variant="ghost"
              onClick={() => setEditing(true)}
              aria-label={`Edit "${task.title}"`}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmingDelete(true)}
              aria-label={`Delete "${task.title}"`}
            >
              Delete
            </Button>
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
