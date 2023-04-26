import { Sensor } from "@acme/db";

export type Severity =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "neutral"
  | "loading";

export type SensorWithFillLevel = {
  sensor: Sensor | undefined;
  fillLevel: number | null;
};
