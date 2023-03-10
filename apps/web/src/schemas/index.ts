import z from "zod";

export const RedirectSchema = z.string().refine((s) => s.startsWith("/"));
