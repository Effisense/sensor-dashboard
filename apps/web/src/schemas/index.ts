import z from "zod";

export const RedirectSchema = z.string().refine((s) => s.startsWith("/"));
export type Redirect = z.infer<typeof RedirectSchema>;

export const ScanSensorSchema = z.object({
  deviceId: z.string(),
  collectionId: z.string(),
});
export type ScanSensor = z.infer<typeof ScanSensorSchema>;
