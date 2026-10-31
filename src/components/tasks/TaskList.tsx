import type { Task, TaskChanges } from "../../types";
import { EmptyState } from "../ui/EmptyState";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
  onToggle: (id: string) => void;
  onEdit: (id: string, changes: TaskChanges) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, emptyMessage, ...handlers }: TaskListProps) {
  if (tasks.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} {...handlers} />
      ))}
    </ul>
  );
}
