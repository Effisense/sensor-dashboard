import { router } from "../trpc";
import { authRouter } from "./auth";
import { mapRouter } from "./map";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
