import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  className = "",
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`resize-none rounded-xl border border-border bg-surface px-3 py-2 text-fg placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary ${className}`}
      {...rest}
    />
  );
}
