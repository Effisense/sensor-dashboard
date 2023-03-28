import { router } from "../trpc";
import { authRouter } from "./auth";
import { containerRouter } from "./container";
import { mapRouter } from "./map";
import { sensorRouter } from "./sensor";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
  sensor: sensorRouter,
  container: containerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
