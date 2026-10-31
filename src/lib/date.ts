import type { Recurrence } from "../types";

export function todayISO(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function addDaysISO(dateISO: string, days: number): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function isDueTodayOrOverdue(
  due: string | undefined,
  today = todayISO(),
): boolean {
  return !!due && due <= today;
}

export function isDueWithinNextDays(
  due: string | undefined,
  days: number,
  today = todayISO(),
): boolean {
  return !!due && due > today && due <= addDaysISO(today, days);
}

export function nextDueDate(due: string, recurrence: Recurrence): string {
  const [year, month, day] = due.split("-").map(Number);
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(`Invalid due date: ${due}`);
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.toISOString().slice(0, 10) !== due) {
    throw new Error(`Invalid due date: ${due}`);
  }

  if (recurrence === "daily" || recurrence === "weekly") {
    date.setUTCDate(date.getUTCDate() + (recurrence === "daily" ? 1 : 7));
  } else {
    const targetYear = year + (recurrence === "yearly" ? 1 : 0);
    const targetMonth = month + (recurrence === "monthly" ? 1 : 0);
    const normalizedYear = targetYear + Math.floor((targetMonth - 1) / 12);
    const normalizedMonth = ((targetMonth - 1) % 12) + 1;
    const lastDay = new Date(
      Date.UTC(normalizedYear, normalizedMonth, 0),
    ).getUTCDate();
    date.setUTCFullYear(normalizedYear, normalizedMonth - 1, Math.min(day, lastDay));
  }

  return date.toISOString().slice(0, 10);
}

export function isOverdue(
  due: string | undefined,
  completed: boolean,
): boolean {
  return !!due && !completed && due < todayISO();
}

export function formatDueDate(due: string): string {
  const [y, m, d] = due.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
