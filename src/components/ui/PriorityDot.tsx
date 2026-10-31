import type { Priority } from "../../types";

const styles: Record<Priority, { color: string; label: string }> = {
  low: { color: "bg-pink-200", label: "Low priority" },
  medium: { color: "bg-accent", label: "Medium priority" },
  high: { color: "bg-primary-hover", label: "High priority" },
};

export function PriorityDot({ priority }: { priority: Priority }) {
  const { color, label } = styles[priority];
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`size-2.5 shrink-0 rounded-full ${color}`}
    />
  );
}
