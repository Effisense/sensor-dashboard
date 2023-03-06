import z from "zod";

export const TestSchema = z.object({
  name: z.string().min(1).max(100),
});
