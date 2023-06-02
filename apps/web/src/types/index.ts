import { SensorSchema } from "@acme/db/src/schema";

export type Severity =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "neutral"
  | "loading";

export type SensorWithFillLevel = {
  sensor: SensorSchema | undefined;
  fillLevel: number | null;
};
