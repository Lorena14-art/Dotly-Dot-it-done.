import { describe, expect, it } from "vitest";
import { taskReducer } from "./taskReducer";
import type { Task } from "../types";

const task = (over: Partial<Task> = {}): Task => ({
  id: "1",
  title: "Water plants",
  completed: false,
  createdAt: 1,
  priority: "medium",
  ...over,
});

describe("taskReducer", () => {
  it("adds a task to the top", () => {
    const result = taskReducer([task({ id: "a" })], {
      type: "add",
      task: task({ id: "b" }),
    });
    expect(result.map((t) => t.id)).toEqual(["b", "a"]);
  });

  it("toggles only the matching task", () => {
    const result = taskReducer([task({ id: "a" }), task({ id: "b" })], {
      type: "toggle",
      id: "a",
    });
    expect(result[0].completed).toBe(true);
    expect(result[1].completed).toBe(false);
  });

  it("clears completed tasks", () => {
    const result = taskReducer(
      [task({ id: "a", completed: true }), task({ id: "b" })],
      { type: "clearCompleted" },
    );
    expect(result.map((t) => t.id)).toEqual(["b"]);
  });
});
