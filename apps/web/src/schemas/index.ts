import { z } from "zod";

export const RedirectSchema = z.string().refine((s) => s.startsWith("/"));
export type Redirect = z.infer<typeof RedirectSchema>;

export const SelectContainerQuerySchema = z.object({
  containerId: z.string(),
});
export type SelectContainerQuery = z.infer<typeof SelectContainerQuerySchema>;

export const SelectDateIntervalQuerySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
export type SelectDateIntervalQuery = z.infer<
  typeof SelectDateIntervalQuerySchema
>;
