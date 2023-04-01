import { z } from "zod";
import { isAdmin } from "../lib/clerk";
import { protectedProcedure, router } from "../trpc";

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

      return await ctx.prisma.user.upsert({
        where: {
          id: userId,
        },
        update: {
          id: userId,
        },
        create: {
          id: userId,
        },
      });
    }),
});
