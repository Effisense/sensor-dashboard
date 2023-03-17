import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { getScale } from "../utils/sensorDataInRange";

export const timeseriesRouter = router({
  sample: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.timeseries.Sensor.select("sensor_id").execute();
    return result;
  }),

  getFillLevelById: publicProcedure
    .input(
      z.object({
        sensorId: z.string(),
      }),
    )
    .query(async ({ ctx, input: { sensorId } }) => {
      // Get most recent sensor data by id
      const result = await ctx.timeseries.Sensor.selectAll()
        .where("sensor_id", "=", sensorId)
        .orderBy("time", "desc")
        .limit(1)
        .execute();

      if (result.length === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No sensor data found",
        });
      }
      getScale(result);

      return result;
    }),

  getSensorDataBetweenDatesById: publicProcedure
    .input(
      z.object({
        sensorId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { sensorId, startDate, endDate } = input;

      // Get sensor data between dates
      const result = await ctx.timeseries.Sensor.selectAll()
        .where("sensor_id", "=", sensorId)
        .where("time", ">=", new Date(startDate))
        .where("time", "<=", new Date(endDate))
        .orderBy("time", "asc")
        .execute();

      if (result.length === 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "No sensor data found",
        });
      }

      return result;
    }),
});
