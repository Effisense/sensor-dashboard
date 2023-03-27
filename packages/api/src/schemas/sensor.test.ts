import { it, expect } from "vitest";
import { SpanApiPayloadSchema } from "./sensor";

it("ScanSensorSchema", () => {
  expect(
    SpanApiPayloadSchema.safeParse({ deviceId: "foo", collectionId: "bar" })
      .success,
  ).toBe(true);
  expect(
    SpanApiPayloadSchema.safeParse({ deviceId: "foo", collectionId: 1 })
      .success,
  ).toBe(false);
  expect(
    SpanApiPayloadSchema.safeParse({ deviceId: 1, collectionId: "bar" })
      .success,
  ).toBe(false);

  expect(SpanApiPayloadSchema.safeParse({}).success).toBe(false);
  expect(SpanApiPayloadSchema.safeParse({ deviceId: "foo" }).success).toBe(
    false,
  );
  expect(SpanApiPayloadSchema.safeParse({ collectionId: "bar" }).success).toBe(
    false,
  );

  expect(
    SpanApiPayloadSchema.safeParse({
      deviceId: "17fk1ja662n2g0",
      collectionId: "17fk1ja662n2g1",
    }).success,
  ).toBe(true);
});
