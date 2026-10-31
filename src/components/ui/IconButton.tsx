import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-label"
> {
  label: string; // required, so icon-only buttons are always accessible
  children: ReactNode;
}

export function IconButton({
  label,
  children,
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`grid size-10 place-items-center rounded-full text-fg transition hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
