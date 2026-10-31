import type { Filter } from "../../types";
import { SegmentedControl } from "../ui/SegmentedControl";

const options: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
];

interface FilterBarProps {
  value: Filter;
  onChange: (filter: Filter) => void;
}

export function FilterBar({ value, onChange }: FilterBarProps) {
  return (
    <SegmentedControl
      label="Filter tasks"
      options={options}
      value={value}
      onChange={onChange}
    />
  );
}
