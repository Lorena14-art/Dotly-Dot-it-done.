import { describe, expect, it } from "vitest";
import { cleanTags } from "./validate";

describe("cleanTags", () => {
  it("trims and removes empty and duplicate tags case-insensitively", () => {
    expect(cleanTags(" Work, personal, work, , Personal ")).toEqual([
      "Work",
      "personal",
    ]);
  });

  it("returns no tags for empty input", () => {
    expect(cleanTags(" , ")).toEqual([]);
  });
});
