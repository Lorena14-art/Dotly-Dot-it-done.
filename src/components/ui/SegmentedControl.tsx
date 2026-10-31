interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-full bg-surface-alt p-1"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-3 py-1 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-primary ${
            o.value === value
              ? "bg-primary text-on-primary"
              : "text-fg hover:bg-surface"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
