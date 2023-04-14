import { router } from "../trpc";
import { userRouter } from "./user";
import { containerRouter } from "./container";
import { mapRouter } from "./map";
import { sensorRouter } from "./sensor";
import { organizationRouter } from "./organization";

export const appRouter = router({
  user: userRouter,
  organization: organizationRouter,
  map: mapRouter,
  sensor: sensorRouter,
  container: containerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
