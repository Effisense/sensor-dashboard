import { router, publicProcedure } from "../trpc";

export const timeseriesRouter = router({
  sample: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.timeseries.Sensor.select("sensor_id").execute();
    return result;
  }),
});
