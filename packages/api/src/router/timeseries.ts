import { router, publicProcedure } from "../trpc";

export const timeseriesRouter = router({
  hello: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.timeseries.Sensor.select("battery").execute();
    console.log(result);

    return "hello";
  }),
});
