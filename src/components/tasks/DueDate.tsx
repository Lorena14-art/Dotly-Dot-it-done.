import { formatDueDate } from "../../lib/date";

interface DueDateProps {
  date: string;
  overdue: boolean;
}

export function DueDate({ date, overdue }: DueDateProps) {
  return (
    <span
      className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        overdue ? "bg-danger/15 text-danger" : "bg-surface-alt text-muted"
      }`}
    >
      {overdue ? "Overdue: " : "Due "}
      {formatDueDate(date)}
    </span>
  );
}
