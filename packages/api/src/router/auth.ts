import { isAdmin } from "../lib/clerk";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  isAdmin: protectedProcedure.query(({ ctx }) => {
    return !!isAdmin(ctx.user);
  }),
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.auth.user;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
});
