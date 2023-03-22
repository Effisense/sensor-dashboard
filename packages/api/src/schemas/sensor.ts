import { z } from "zod";

export const SensorSchema = z.object({
  deviceId: z.string(),
  collectionId: z.string(),
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  containerId: z.string(),
});

export const SensorIdSchema = SensorSchema.pick({
  deviceId: true,
});
