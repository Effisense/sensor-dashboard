import { getLocationFromLngLat } from "@acme/mapbox";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { userIsMemberOfOrganization } from "../lib/clerk";
import {
  SensorIdSchema,
  SensorSchema,
  SpanApiPayloadSchema,
  UpdateSensorSchema,
} from "../schemas/sensor";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import {
  sensorBelongsToCollection as _sensorBelongsToCollection,
  getFillLevel,
} from "../utils/sensor";
import { Sensor as TimeseriesSensor } from "../lib/kysely";
import { Organization, Sensor } from "@acme/db/src/schema";
import { eq } from "drizzle-orm";

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

      const containerExists = containerId
        ? await ctx.db.query.Container.findFirst({
            where: (Container, { eq }) => eq(Container.id, containerId),
          })
            .execute()
            .then((container) => !!container)
            .catch(() => false)
        : false;

      if (!containerExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Container not found",
        });
      }

      await ctx.db
        .insert(Organization)
        .values({
          id: ctx.auth.organizationId,
        })
        .onDuplicateKeyUpdate({
          set: {
            id: ctx.auth.organizationId,
          },
        })
        .execute();

      return await ctx.db
        .insert(Sensor)
        .values({
          id: sensorId,
          collectionId,
          latitude,
          longitude,
          name,
          description,
          location: location || "",
          containerId,
          organizationId: ctx.auth.organizationId,
        })
        .execute()
        .then((sensor) => sensor)
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
          code: "UNAUTHORIZED",
          message: "You are not part of this organization",
        });
      }

      const sensor = await ctx.db.query.Sensor.findFirst({
        where: (Sensor, { eq }) => eq(Sensor.id, id),
      })
        .execute()
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
          code: "UNAUTHORIZED",
          message: "Your organization does not own this sensor",
        });
      }

      const container = sensor.containerId
        ? await ctx.db.query.Container.findFirst({
            where: (Container, { eq }) =>
              eq(Container.id, sensor.containerId as number),
          })
        : null;

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

    return await ctx.db.query.Sensor.findMany({
      where: (Sensor, { eq }) =>
        eq(Sensor.organizationId, ctx.auth.organizationId as string),
    }).execute();
  }),

  getWithFillLevelBetweenDates: protectedProcedure
    .input(
      z.object({
        sensorId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { sensorId, startDate, endDate } = input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      const sensor = await ctx.db.query.Sensor.findFirst({
        where: (Sensor, { eq }) => eq(Sensor.id, sensorId),
        columns: {
          id: true,
          containerId: true,
        },
      })
        .execute()
        .then((sensor) => sensor);

      // Get the associated container object
      if (!sensor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sensor not found",
        });
      }

      // Get data from timeseries between dates
      const timeseries = await TimeseriesSensor.selectAll()
        .where("sensor_id", "=", sensorId)
        .where("time", ">=", startDate)
        .where("time", "<=", endDate)
        .orderBy("time", "asc")
        .execute();

      const container = sensor.containerId
        ? await ctx.db.query.Container.findFirst({
            where: (Container, { eq }) =>
              eq(Container.id, sensor.containerId as number),
          }).execute()
        : null;

      if (!container) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Container not found",
        });
      }

      const result = timeseries.map((data) => {
        const datetime = data.time;
        const fillLevel = getFillLevel({ timeseries: data, container });
        return {
          datetime,
          fillLevel,
        };
      });

      return result;
    }),

  getWithFillLevel: protectedProcedure
    .input(
      z.object({
        sensorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { sensorId } = input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      const sensor = await ctx.db.query.Sensor.findFirst({
        where: (Sensor, { eq }) => eq(Sensor.id, sensorId),
      }).execute();

      if (!sensor) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sensor not found",
        });
      }

      const container = sensor.containerId
        ? await ctx.db.query.Container.findFirst({
            where: (Container, { eq }) =>
              eq(Container.id, sensor.containerId as number),
          }).execute()
        : null;

      if (!container) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Container not found",
        });
      }

      // Get the latest data from timeseries
      const timeseriesData = await TimeseriesSensor.selectAll()
        .where("sensor_id", "=", sensorId)
        .orderBy("time", "desc")
        .limit(1)
        .execute();

      // Check if there is timeseries data
      if (timeseriesData.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Timeseries data not found",
        });
      }

      const fillLevel = getFillLevel({
        timeseries: timeseriesData[0],
        container,
      });

      return {
        sensor,
        fillLevel,
      };
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

      return await ctx.db
        .update(Sensor)
        .set({
          latitude,
          longitude,
          name,
          description,
          location: location || "",
          containerId,
          organizationId: ctx.auth.organizationId,
        })
        .where(eq(Sensor.id, sensorId))
        .execute();
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

      return await ctx.db
        .delete(Sensor)
        .where(eq(Sensor.id, sensorId))
        .execute();
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

    const sensors = await ctx.db.query.Sensor.findMany({
      where: (Sensor, { eq }) =>
        eq(Sensor.organizationId, ctx.auth.organizationId as string),
      with: {
        Container: true,
      },
    });

    // TODO: Optimize this query to decrease the query wait time
    const sensorsWithFillLevel = [];
    for (const sensor of sensors) {
      if (!sensor.containerId) continue;

      const timeseries = await TimeseriesSensor.selectAll()
        .where("sensor_id", "=", sensor.id)
        .orderBy("time", "desc")
        .limit(1)
        .execute()
        .then((value) => value[0]);

      const fillLevel = getFillLevel({
        timeseries,
        container: sensor.Container,
      });

      sensorsWithFillLevel.push({ sensor, fillLevel });
    }

    return sensorsWithFillLevel;
  }),
});
