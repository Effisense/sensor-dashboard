import { getLocationFromLngLat } from "@acme/mapbox";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Sensor } from "../lib/kysely";
import {
  SensorIdSchema,
  SensorSchema,
  SpanApiPayloadSchema,
} from "../schemas/sensor";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { sensorBelongsToCollection as _sensorBelongsToCollection } from "../utils/sensor";

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
        containerTypeId,
      } = input;

      const sensorBelongsToCollection = await _sensorBelongsToCollection(
        sensorId,
        collectionId,
      );
      if (!sensorBelongsToCollection) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Sensor does not belong to collection",
        });
      }

      const location = await getLocationFromLngLat({
        latitude,
        longitude,
      }).catch((err) => {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: err.message,
        });
      });

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      const containerTypeExists = await ctx.prisma.containerType
        .findUnique({
          where: {
            id: containerTypeId,
          },
        })
        .then((containerType) => !!containerType)
        .catch(() => false);

      if (!containerTypeExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Container type not found",
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
          containerTypeId,
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

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

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

      const sensorBelongsToOrganization =
        sensor.organizationId === ctx.auth.organizationId;
      if (!sensorBelongsToOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Your organization does not own this sensor",
        });
      }

      const containerType = await ctx.prisma.containerType.findUnique({
        where: {
          id: sensor.containerTypeId,
        },
      });

      const timeseries = Sensor.selectAll()
        .where("sensor_id", "=", id)
        .orderBy("time", "desc")
        .limit(1)
        .execute();

      return {
        sensor,
        timeseries,
        containerType,
      };
    }),

  update: protectedProcedure
    .input(SensorSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        sensorId,
        collectionId,
        name,
        description,
        latitude,
        longitude,
        containerTypeId,
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
          id: sensorId,
        },
        data: {
          collectionId,
          latitude,
          longitude,
          name,
          description,
          location: location || "",
          containerTypeId,
          organizationId: ctx.auth.organizationId,
        },
      });
    }),

  delete: protectedProcedure
    .input(SensorIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { sensorId } = input;

      // TODO: Maybe we need to delete the container as well?

      return ctx.prisma.sensor.delete({
        where: {
          id: sensorId,
        },
      });
    }),

  sensorBelongsToCollection: publicProcedure
    .input(SpanApiPayloadSchema)
    .query(async ({ ctx, input }) => {}),
});
