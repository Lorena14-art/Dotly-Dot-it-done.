import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function Field({ label, children, className = "" }: FieldProps) {
  return (
    <label
      className={`flex flex-col gap-1 text-xs font-semibold text-muted ${className}`}
    >
      <span>{label}</span>
      {children}
    </label>
  );
}
