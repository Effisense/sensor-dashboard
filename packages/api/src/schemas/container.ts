import { z } from "zod";

const numberGreaterThanOne = z
  .number()
  .min(1, { message: "Must be greater than 1" });

export const ContainerSchema = z.object({
  containerId: z.number(),
  name: z.string().min(1, { message: "Required" }),
  description: z.string(),
  targetFillLevelInPercent: z
    .number()
    .min(0, { message: "Must be between 0 and 100" })
    .max(100, { message: "Must be between 0 and 100" }),
  binHeightInMillimeters: numberGreaterThanOne,
  binWidthInMillimeters: numberGreaterThanOne.optional(),
  sensorOffsetInMillimeters: numberGreaterThanOne,
  containerVolumeInLiters: numberGreaterThanOne,
});

export const ContainerFormSchema = ContainerSchema.omit({
  containerId: true,
});

export const ContainerIdSchema = ContainerSchema.pick({
  containerId: true,
});
