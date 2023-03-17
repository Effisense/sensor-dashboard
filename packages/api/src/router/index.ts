import { router } from "../trpc";
import { authRouter } from "./auth";
import { mapRouter } from "./map";
import { timeseriesRouter } from "./timeseries";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
  timeseries: timeseriesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
