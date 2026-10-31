interface DotCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function DotCheckbox({ checked, onChange, label }: DotCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-primary transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span
        className={`size-3 rounded-full bg-primary transition-transform duration-150 ${
          checked ? "scale-100" : "scale-0"
        }`}
      />
    </button>
  );
}
