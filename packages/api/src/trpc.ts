import { initTRPC, TRPCError } from "@trpc/server";
import { type Context } from "./context";
import superjson from "superjson";
import { isAdmin as _isAdmin } from "./lib/clerk";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      user: ctx.auth.user,
    },
  });
});

const isAdmin = t.middleware(({ next, ctx }) => {
  if (!ctx.auth.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  if (!_isAdmin(ctx.auth.user)) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized" });
  }

  return next({
    ctx: {
      user: ctx.auth.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
