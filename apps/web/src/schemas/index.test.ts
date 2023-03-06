import { it, assert, expect } from "vitest";
import { TestSchema } from ".";

it("demo", () => {
  assert(true);
  expect(true).toBe(true);
});

it("sample schema", () => {
  expect(TestSchema.safeParse({ name: "test" }).success).toEqual(true);
  expect(TestSchema.safeParse({ name: "" }).success).toEqual(false);
});
