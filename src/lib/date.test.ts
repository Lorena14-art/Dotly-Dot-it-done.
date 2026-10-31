import { describe, expect, it } from "vitest";
import {
  isDueTodayOrOverdue,
  isDueWithinNextDays,
  nextDueDate,
} from "./date";

describe("due-date filters", () => {
  it("includes overdue and today dates in the Today view", () => {
    expect(isDueTodayOrOverdue("2026-03-01", "2026-03-02")).toBe(true);
    expect(isDueTodayOrOverdue("2026-03-02", "2026-03-02")).toBe(true);
    expect(isDueTodayOrOverdue("2026-03-03", "2026-03-02")).toBe(false);
    expect(isDueTodayOrOverdue(undefined, "2026-03-02")).toBe(false);
  });

  it("includes dates in the next seven days but excludes today and later dates", () => {
    expect(isDueWithinNextDays("2026-03-03", 7, "2026-03-02")).toBe(true);
    expect(isDueWithinNextDays("2026-03-09", 7, "2026-03-02")).toBe(true);
    expect(isDueWithinNextDays("2026-03-02", 7, "2026-03-02")).toBe(false);
    expect(isDueWithinNextDays("2026-03-10", 7, "2026-03-02")).toBe(false);
    expect(isDueWithinNextDays(undefined, 7, "2026-03-02")).toBe(false);
  });
});

describe("nextDueDate", () => {
  it("advances daily and weekly dates", () => {
    expect(nextDueDate("2026-03-01", "daily")).toBe("2026-03-02");
    expect(nextDueDate("2026-03-01", "weekly")).toBe("2026-03-08");
  });

  it("clamps monthly dates to the last day of the next month", () => {
    expect(nextDueDate("2026-01-31", "monthly")).toBe("2026-02-28");
  });

  it("clamps yearly leap-day dates in non-leap years", () => {
    expect(nextDueDate("2024-02-29", "yearly")).toBe("2025-02-28");
  });

  it("rejects invalid dates", () => {
    expect(() => nextDueDate("2026-02-30", "daily")).toThrow(
      "Invalid due date",
    );
  });
});
