import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative ${className}`}>
      <select
        className="h-full w-full cursor-pointer appearance-none rounded-xl border border-border bg-surface py-2 pr-10 pl-3 text-fg focus-visible:outline-2 focus-visible:outline-primary"
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-primary"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
