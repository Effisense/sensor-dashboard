import { z } from "zod";
import { isAdmin } from "../lib/clerk";
import { protectedProcedure, router } from "../trpc";
import { User } from "@acme/db/src/schema";

export const userRouter = router({
  isAdmin: protectedProcedure.query(({ ctx }) => {
    return !!isAdmin(ctx.user);
  }),
  createIfNotExists: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      return await ctx.db
        .insert(User)
        .values({ id: userId })
        .onDuplicateKeyUpdate({ set: { id: userId } })
        .execute();
    }),
});
