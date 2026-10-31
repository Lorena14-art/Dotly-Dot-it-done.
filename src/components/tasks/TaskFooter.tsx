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
    <div className="flex items-center justify-between text-sm text-muted">
      <span>
        {remaining} {remaining === 1 ? "item" : "items"} left
      </span>
      {hasCompleted && (
        <Button variant="ghost" onClick={onClearCompleted}>
          Clear completed
        </Button>
      )}
    </div>
  );
}
