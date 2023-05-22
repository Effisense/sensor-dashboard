import { z } from "zod";

export const RedirectSchema = z.string().refine((s) => s.startsWith("/"));
export type Redirect = z.infer<typeof RedirectSchema>;

export const SelectContainerQuerySchema = z.object({
  containerId: z.string(),
});
export type SelectContainerQuery = z.infer<typeof SelectContainerQuerySchema>;
