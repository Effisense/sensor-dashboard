import { it, expect } from "vitest";
import { RedirectSchema, ScanSensorSchema } from ".";

it("RedirectSchema", () => {
  expect(RedirectSchema.safeParse("/").success).toBe(true);
  expect(RedirectSchema.safeParse("/foo").success).toBe(true);
  expect(RedirectSchema.safeParse("foo").success).toBe(false);
});

it("ScanSensorSchema", () => {
  expect(
    ScanSensorSchema.safeParse({ deviceId: "foo", collectionId: "bar" })
      .success,
  ).toBe(true);
  expect(
    ScanSensorSchema.safeParse({ deviceId: "foo", collectionId: 1 }).success,
  ).toBe(false);
  expect(
    ScanSensorSchema.safeParse({ deviceId: 1, collectionId: "bar" }).success,
  ).toBe(false);

  expect(ScanSensorSchema.safeParse({}).success).toBe(false);
  expect(ScanSensorSchema.safeParse({ deviceId: "foo" }).success).toBe(false);
  expect(ScanSensorSchema.safeParse({ collectionId: "bar" }).success).toBe(
    false,
  );

  expect(
    ScanSensorSchema.safeParse({
      deviceId: "17fk1ja662n2g0",
      collectionId: "17fk1ja662n2g1",
    }).success,
  ).toBe(true);
});
