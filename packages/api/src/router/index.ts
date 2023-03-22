import { router } from "../trpc";
import { authRouter } from "./auth";
import { containerTypeRouter } from "./containerType";
import { mapRouter } from "./map";
import { sensorRouter } from "./sensor";
import { testRouter } from "./test";

export const appRouter = router({
  auth: authRouter,
  map: mapRouter,
  sensor: sensorRouter,
  containerType: containerTypeRouter,
  test: testRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
