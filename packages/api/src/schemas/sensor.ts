import { z } from "zod";

export const SensorSchema = z.object({
  sensorId: z.string(),
  collectionId: z.string(),
  name: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  latitude: z
    .number()
    .min(-90, { message: "Must be between -90 and 90" })
    .max(90, { message: "Must be between -90 and 90" }),
  longitude: z
    .number()
    .min(-180, { message: "Must be between -180 and 180" })
    .max(180, { message: "Must be between -180 and 180" }),
  containerId: z.number().optional(),
});
export type Sensor = z.infer<typeof SensorSchema>;

export const SensorIdSchema = SensorSchema.pick({
  sensorId: true,
});

export const UpdateSensorSchema = SensorSchema.omit({
  collectionId: true,
});

export const SpanApiPayloadSchema = z.object({
  deviceId: z.string(),
  collectionId: z.string(),
});
export type SpanApiPayload = z.infer<typeof SpanApiPayloadSchema>;
