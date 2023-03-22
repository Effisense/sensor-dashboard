import { getLocationFromLngLat } from "@acme/mapbox";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Sensor } from "../lib/kysely";
import { SensorIdSchema, SensorSchema } from "../schemas/sensor";
import { protectedProcedure, router } from "../trpc";

export const sensorRouter = router({
  create: protectedProcedure
    .input(SensorSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        sensorId,
        collectionId,
        name,
        description,
        latitude,
        longitude,
        containerId,
      } = input;

      const location = await getLocationFromLngLat({
        latitude,
        longitude,
      }).catch((err) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      });

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      return ctx.prisma.sensor.create({
        data: {
          id: sensorId,
          collectionId,
          latitude,
          longitude,
          name,
          description,
          location: location || "",
          containerId,
          organizationId: ctx.auth.organizationId,
        },
      });
    }),

  exists: protectedProcedure
    .input(SensorIdSchema)
    .query(async ({ ctx, input }) => {
      const { sensorId } = input;

      const exists = await ctx.prisma.sensor
        .findUnique({
          where: {
            id: sensorId,
          },
        })
        .then((sensor) => !!sensor)
        .catch(() => false);

      return exists;
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const sensor = await ctx.prisma.sensor.findUnique({
        where: {
          id,
        },
      });

      if (!sensor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sensor not found",
        });
      }

      if (sensor.organizationId !== ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sensor does not belong to the organization",
        });
      }

      const timeseries = Sensor.selectAll()
        .where("sensor_id", "=", id)
        .orderBy("time", "desc")
        .limit(1)
        .execute();

      return {
        sensor,
        timeseries,
      };
    }),

  update: protectedProcedure
    .input(SensorSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        sensorId: deviceId,
        collectionId,
        name,
        description,
        latitude,
        longitude,
        containerId,
      } = input;

      const location = await getLocationFromLngLat({
        latitude,
        longitude,
      }).catch((err) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      });

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      return ctx.prisma.sensor.update({
        where: {
          id: deviceId,
        },
        data: {
          collectionId,
          latitude,
          longitude,
          name,
          description,
          location: location || "",
          containerId,
          organizationId: ctx.auth.organizationId,
        },
      });
    }),

  delete: protectedProcedure
    .input(SensorIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { sensorId: deviceId } = input;

      // TODO: Maybe we need to delete the container as well?

      return ctx.prisma.sensor.delete({
        where: {
          id: deviceId,
        },
      });
    }),
});
