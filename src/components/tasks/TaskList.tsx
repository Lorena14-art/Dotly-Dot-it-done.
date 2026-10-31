import type { Task, TaskChanges } from "../../types";
import { useState } from "react";
import { EmptyState } from "../ui/EmptyState";
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
}

export function TaskList({
  tasks,
  emptyMessage,
  onReorder,
  ...handlers
}: TaskListProps) {
  const [announcement, setAnnouncement] = useState("");

  if (tasks.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <ul className="space-y-2">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
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
    </>
  );
}
