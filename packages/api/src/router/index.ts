import { router } from "../trpc";
import { postRouter } from "./post";
import { authRouter } from "./auth";
import { mapRouter } from "./map";

export const appRouter = router({
  post: postRouter,
  auth: authRouter,
  map: mapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
