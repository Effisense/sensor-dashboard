import { isAdmin } from "../lib/clerk";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  isAdmin: protectedProcedure.query(({ ctx }) => {
    return !!isAdmin(ctx.user);
  }),
});
