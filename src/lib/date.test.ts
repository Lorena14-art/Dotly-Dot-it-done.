import { describe, expect, it } from "vitest";
import { nextDueDate } from "./date";

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
