import { getLocationFromLngLat } from "@acme/mapbox";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Sensor } from "../lib/kysely";
import { userIsMemberOfOrganization } from "../lib/clerk";
import {
  SensorIdSchema,
  SensorSchema,
  SpanApiPayloadSchema,
  UpdateSensorSchema,
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
        containerId,
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

      const isMemberOfOrganization = await userIsMemberOfOrganization(
        ctx.auth.user?.id,
        ctx.auth.organizationId,
      );
      if (!isMemberOfOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not part of this organization",
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

      const containerExists = await ctx.prisma.container
        .findUnique({
          where: {
            id: containerId,
          },
        })
        .then((container) => !!container)
        .catch(() => false);

      if (!containerExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Container not found",
        });
      }

      await ctx.prisma.organization
        .upsert({
          where: {
            id: ctx.auth.organizationId,
          },
          update: {
            id: ctx.auth.organizationId,
          },
          create: {
            id: ctx.auth.organizationId,
          },
        })
        .then((org) => org);

      return ctx.prisma.sensor
        .create({
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
        })
        .catch(() => {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "It seems like this sensor already exists.",
          });
        });
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

      const isMemberOfOrganization = await userIsMemberOfOrganization(
        ctx.auth.user?.id,
        ctx.auth.organizationId,
      );
      if (!isMemberOfOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not part of this organization",
        });
      }

      const sensor = await ctx.prisma.sensor
        .findUnique({
          where: {
            id,
          },
        })
        .then((sensor) => sensor);

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

      const container = await ctx.prisma.container.findUnique({
        where: {
          id: sensor.containerId || undefined || "",
        },
      });

      return {
        sensor,
        container,
      };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.organizationId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Organization not found",
      });
    }

    const isMemberOfOrganization = await userIsMemberOfOrganization(
      ctx.auth.user?.id,
      ctx.auth.organizationId,
    );
    if (!isMemberOfOrganization) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not part of this organization",
      });
    }

    return await ctx.prisma.sensor.findMany({
      where: {
        organizationId: ctx.auth.organizationId,
      },
    });
  }),

  update: protectedProcedure
    .input(UpdateSensorSchema)
    .mutation(async ({ ctx, input }) => {
      const { sensorId, name, description, latitude, longitude, containerId } =
        input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      const isMemberOfOrganization = await userIsMemberOfOrganization(
        ctx.auth.user?.id,
        ctx.auth.organizationId,
      );
      if (!isMemberOfOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not part of this organization",
        });
      }

      const location = await getLocationFromLngLat({
        latitude,
        longitude,
      }).catch((err) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      });

      return ctx.prisma.sensor.update({
        where: {
          id: sensorId,
        },
        data: {
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
      const { sensorId } = input;

      const isMemberOfOrganization = await userIsMemberOfOrganization(
        ctx.auth.user?.id,
        ctx.auth.organizationId,
      );
      if (!isMemberOfOrganization) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are not part of this organization",
        });
      }

      // TODO: Maybe we need to delete the container as well?

      return ctx.prisma.sensor.delete({
        where: {
          id: sensorId,
        },
      });
    }),

  belongsToCollection: publicProcedure
    .input(SpanApiPayloadSchema)
    .query(async ({ input }) => {
      const { deviceId, collectionId } = input;
      return await _sensorBelongsToCollection(deviceId, collectionId);
    }),

  getAllSensorsWithFillLevel: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.organizationId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Organization not found",
      });
    }

    const isMemberOfOrganization = await userIsMemberOfOrganization(
      ctx.auth.user?.id,
      ctx.auth.organizationId,
    );
    if (!isMemberOfOrganization) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You are not part of this organization",
      });
    }

    const sensors = await ctx.prisma.sensor.findMany({
      where: {
        organizationId: ctx.auth.organizationId,
      },
    });

    const sensorsWithFillLevel = [];

    for (const sensor of sensors) {
      if (!sensor.containerId) continue;

      const timeseries = await Sensor.selectAll()
        .where("sensor_id", "=", sensor.id)
        .orderBy("time", "desc")
        .limit(1)
        .execute()
        .then((value) => value[0]);

      const container = await ctx.prisma.container.findUnique({
        where: {
          id: sensor.containerId,
        },
      });

      // const fillLevel = getFillLevel(timeseries, container);
      const fillLevel = 83; // TODO: Dummy value, replace with actual value from the function above

      sensorsWithFillLevel.push({ sensor, fillLevel });
    }

    return sensorsWithFillLevel;
  }),
});
