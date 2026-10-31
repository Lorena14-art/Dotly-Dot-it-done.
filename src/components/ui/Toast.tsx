import { useEffect } from "react";
import { Button } from "./Button";

interface ToastProps {
  message: string;
  actionLabel: string;
  onAction: () => void;
  onDismiss: () => void;
  duration?: number;
}

export function Toast({
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div
      role="status"
      className="fixed left-1/2 top-6 z-50 grid min-w-64 -translate-x-1/2 grid-cols-[1fr_auto_1fr] items-center rounded-2xl bg-fg px-3 py-1 text-sm text-bg shadow-lg"
    >
      <span className="col-start-2 text-center">{message}</span>
      <Button
        variant="ghost"
        onClick={onAction}
        className="col-start-3 justify-self-end px-2 py-1 text-accent hover:bg-transparent hover:underline"
      >
        {actionLabel}
      </Button>
    </div>
  );
}
