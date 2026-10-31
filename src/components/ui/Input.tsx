import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-xl border border-border bg-surface px-3 py-2 text-fg placeholder:text-muted focus-visible:outline-2 focus-visible:outline-primary ${className}`}
      {...rest}
    />
  );
}
