import { Button } from "../ui/Button";

interface TaskFooterProps {
  remaining: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export function TaskFooter({
  remaining,
  hasCompleted,
  onClearCompleted,
}: TaskFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-muted">
      <span className="whitespace-nowrap">
        {remaining} {remaining === 1 ? "item" : "items"} left
      </span>
      {hasCompleted && (
        <Button
          variant="ghost"
          onClick={onClearCompleted}
          className="whitespace-nowrap"
        >
          Clear completed
        </Button>
      )}
    </div>
  );
}
