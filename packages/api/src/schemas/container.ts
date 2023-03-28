import { z } from "zod";

export const ContainerSchema = z.object({
  containerTypeId: z.string(),
  name: z.string(),
  description: z.string(),
  targetFillLevelInPercent: z.number(),
  binHeightInMillimeters: z.number(),
  binWidthInMillimeters: z.number(),
  sensorOffsetInMillimeters: z.number(),
  containerVolumeInLiters: z.number(),
});

export const CreateContainerSchema = ContainerSchema.omit({
  containerTypeId: true,
});

export const ContainerIdSchema = ContainerSchema.pick({
  containerTypeId: true,
});
