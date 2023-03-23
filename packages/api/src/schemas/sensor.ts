import { z } from "zod";

export const SensorSchema = z.object({
  sensorId: z.string(),
  collectionId: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  containerTypeId: z.string(),
});

export const SensorIdSchema = SensorSchema.pick({
  sensorId: true,
});
