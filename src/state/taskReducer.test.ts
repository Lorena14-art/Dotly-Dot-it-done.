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

  it("creates the next recurring occurrence when completing a task", () => {
    const result = taskReducer(
      [
        task({
          id: "repeat",
          recurrence: "monthly",
          dueDate: "2026-01-31",
          checklist: [
            { id: "step", text: "First step", completed: true },
          ],
        }),
        task({ id: "other" }),
      ],
      {
        type: "toggle",
        id: "repeat",
        nextOccurrence: { id: "next", createdAt: 2 },
      },
    );

    expect(result.map((item) => item.id)).toEqual(["next", "repeat", "other"]);
    expect(result[0]).toMatchObject({
      completed: false,
      dueDate: "2026-02-28",
      recurrence: "monthly",
      checklist: [{ id: "step", text: "First step", completed: false }],
    });
    expect(result[1].completed).toBe(true);
  });

  it("toggles only the matching checklist item", () => {
    const result = taskReducer(
      [
        task({
          id: "a",
          checklist: [
            { id: "one", text: "First step", completed: false },
            { id: "two", text: "Second step", completed: false },
          ],
        }),
        task({ id: "b" }),
      ],
      { type: "toggleChecklistItem", id: "a", itemId: "two" },
    );

    expect(result[0].checklist?.map((item) => item.completed)).toEqual([
      false,
      true,
    ]);
    expect(result[1].checklist).toBeUndefined();
  });

  it("marks selected tasks complete and creates recurring occurrences", () => {
    const result = taskReducer(
      [
        task({ id: "repeat", recurrence: "weekly", dueDate: "2026-03-01" }),
        task({ id: "plain" }),
        task({ id: "unselected" }),
      ],
      {
        type: "setCompleted",
        ids: ["repeat", "plain"],
        completed: true,
        nextOccurrences: {
          repeat: { id: "next", createdAt: 4 },
        },
      },
    );

    expect(result.map((item) => item.id)).toEqual([
      "next",
      "repeat",
      "plain",
      "unselected",
    ]);
    expect(result[0].dueDate).toBe("2026-03-08");
    expect(result[1].completed).toBe(true);
    expect(result[2].completed).toBe(true);
    expect(result[3].completed).toBe(false);
  });

  it("deletes and restores multiple tasks", () => {
    const initial = [task({ id: "a" }), task({ id: "b" }), task({ id: "c" })];
    const deleted = taskReducer(initial, {
      type: "deleteMany",
      ids: ["a", "c"],
    });
    const restored = taskReducer(deleted, {
      type: "restoreMany",
      tasks: [initial[0], initial[2]],
    });

    expect(deleted.map((item) => item.id)).toEqual(["b"]);
    expect(restored).toHaveLength(3);
    expect(new Set(restored.map((item) => item.id))).toEqual(
      new Set(["a", "b", "c"]),
    );
  });

  it("clears completed tasks", () => {
    const result = taskReducer(
      [task({ id: "a", completed: true }), task({ id: "b" })],
      { type: "clearCompleted" },
    );
    expect(result.map((t) => t.id)).toEqual(["b"]);
  });

  it("moves a task before another task", () => {
    const result = taskReducer(
      [task({ id: "a" }), task({ id: "b" }), task({ id: "c" })],
      { type: "reorder", id: "c", targetId: "a", position: "before" },
    );
    expect(result.map((t) => t.id)).toEqual(["c", "a", "b"]);
  });

  it("moves a task after another task", () => {
    const result = taskReducer(
      [task({ id: "a" }), task({ id: "b" }), task({ id: "c" })],
      { type: "reorder", id: "a", targetId: "b", position: "after" },
    );
    expect(result.map((t) => t.id)).toEqual(["b", "a", "c"]);
  });
});
