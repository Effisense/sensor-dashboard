import { z } from "zod";

export const ContainerTypeSchema = z.object({
  containerTypeId: z.string(),
  name: z.string(),
  description: z.string(),
  targetFillLevelInPercent: z.number(),
  binHeightInMillimeters: z.number(),
  binWidthInMillimeters: z.number(),
  sensorOffsetInMillimeters: z.number(),
  containerVolumeInLiters: z.number(),
});

export const CreateContainerTypeSchema = ContainerTypeSchema.omit({
  containerTypeId: true,
});

export const ContainerTypeIdSchema = ContainerTypeSchema.pick({
  containerTypeId: true,
});
