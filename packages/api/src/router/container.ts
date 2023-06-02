import { TRPCError } from "@trpc/server";
import { userIsMemberOfOrganization } from "../lib/clerk";
import {
  ContainerIdSchema,
  ContainerSchema,
  ContainerFormSchema,
} from "../schemas/container";
import { protectedProcedure, router } from "../trpc";
import { getFillLevel } from "../utils/sensor";
import { Sensor } from "../lib/kysely";
import { Container } from "@acme/db/src/schema";
import { eq } from "drizzle-orm";

export const containerRouter = router({
  create: protectedProcedure
    .input(ContainerFormSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        name,
        description,
        binHeightInMillimeters,
        binWidthInMillimeters,
        containerVolumeInLiters,
        sensorOffsetInMillimeters,
        targetFillLevelInPercent,
      } = input;

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

      return await ctx.db
        .insert(Container)
        .values({
          name,
          description,
          binHeightInMillimeters,
          binWidthInMillimeters,
          containerVolumeInLiters,
          sensorOffsetInMillimeters,
          targetFillLevelInPercent,
          organizationId: ctx.auth.organizationId,
        })
        .execute();
    }),

  get: protectedProcedure
    .input(ContainerIdSchema)
    .query(async ({ ctx, input }) => {
      const { containerId } = input;

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

      const container = await ctx.db.query.Container.findFirst({
        where: (Container, { eq }) => eq(Container.id, containerId),
      }).execute();

      if (!container) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Container not found",
        });
      }

      return container;
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

    return await ctx.db.query.Container.findMany({
      where: (Container, { eq }) =>
        eq(Container.organizationId, ctx.auth.organizationId as string),
    }).execute();
  }),

  getSensorsByContainerId: protectedProcedure
    .input(ContainerIdSchema)
    .query(async ({ ctx, input }) => {
      const { containerId } = input;

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
        where: (Sensor, { eq }) => eq(Sensor.containerId, containerId),
        with: {
          Container: true,
        },
      }).execute();

      const sensorsWithFillLevel = [];

      for (const sensor of sensors) {
        if (!sensor.containerId) continue;

        const timeseries = await Sensor.selectAll()
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

  update: protectedProcedure
    .input(ContainerSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        containerId,
        name,
        description,
        binHeightInMillimeters,
        binWidthInMillimeters,
        containerVolumeInLiters,
        sensorOffsetInMillimeters,
        targetFillLevelInPercent,
      } = input;

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

      return await ctx.db
        .update(Container)
        .set({
          name,
          description,
          binHeightInMillimeters,
          binWidthInMillimeters,
          containerVolumeInLiters,
          sensorOffsetInMillimeters,
          targetFillLevelInPercent,
        })
        .where(eq(Container.id, containerId))
        .execute();
    }),

  delete: protectedProcedure
    .input(ContainerIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { containerId } = input;

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

      return await ctx.db
        .delete(Container)
        .where(eq(Container.id, containerId))
        .execute();
    }),
});
