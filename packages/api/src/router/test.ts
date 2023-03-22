import { Sensor } from "../lib/kysely";
import { publicProcedure, router } from "../trpc";

export const testRouter = router({
  getSensorData: publicProcedure.query(async ({ ctx }) => {
    return Sensor.selectAll().execute();
  }),
});
