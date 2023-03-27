import { it, expect } from "vitest";
import { RedirectSchema } from ".";

it("RedirectSchema", () => {
  expect(RedirectSchema.safeParse("/").success).toBe(true);
  expect(RedirectSchema.safeParse("/foo").success).toBe(true);
  expect(RedirectSchema.safeParse("foo").success).toBe(false);
});
