import { router } from "../trpc";
import { authRouter } from "./auth";
import { containerTypeRouter } from "./containerType";
import { mapRouter } from "./map";
import { sensorRouter } from "./sensor";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
  sensor: sensorRouter,
  containerType: containerTypeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
