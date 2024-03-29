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

      return ctx.prisma.container.create({
        data: {
          name,
          description,
          binHeightInMillimeters,
          binWidthInMillimeters,
          containerVolumeInLiters,
          sensorOffsetInMillimeters,
          targetFillLevelInPercent,
          organizationId: ctx.auth.organizationId,
        },
      });
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

      const container = await ctx.prisma.container.findUnique({
        where: {
          id: containerId,
        },
      });

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

    return ctx.prisma.container.findMany({
      where: {
        organizationId: ctx.auth.organizationId,
      },
    });
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

      const sensors = await ctx.prisma.sensor.findMany({
        where: {
          containerId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          organizationId: true,
          latitude: true,
          longitude: true,
          collectionId: true,
          location: true,
          containerId: true,
          container: true,
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

        const fillLevel = getFillLevel({
          timeseries,
          container: sensor.container,
        });

        sensorsWithFillLevel.push({
          sensor,
          fillLevel,
          lastSeen: timeseries?.time || null,
        });
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

      return ctx.prisma.container.update({
        where: {
          id: containerId,
        },
        data: {
          name,
          description,
          binHeightInMillimeters,
          binWidthInMillimeters,
          containerVolumeInLiters,
          sensorOffsetInMillimeters,
          targetFillLevelInPercent,
        },
      });
    }),

  delete: protectedProcedure
    .input(ContainerIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { containerId: containerTypeId } = input;

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

      return ctx.prisma.container.delete({
        where: {
          id: containerTypeId,
        },
      });
    }),

  getAllContainersWithSensorsAndFillLevel: protectedProcedure.query(
    async ({ ctx }) => {
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

      //get all containers associated with the organization
      const containers = await ctx.prisma.container.findMany({
        where: {
          organizationId: ctx.auth.organizationId,
        },
      });

      //get all sensors associated with the organization
      const sensors = await ctx.prisma.sensor.findMany({
        where: {
          organizationId: ctx.auth.organizationId,
        },
      });

      //Map over all containers and add the sensors and fill level to each container
      const containersWithSensorsAndFillLevel = containers.map((container) => {
        const sensorsForContainer = sensors.filter(
          (sensor) => sensor.containerId === container.id,
        );

        // const fillLevel = getFillLevel(timeseries, containerType);
        const fillLevel = 83; // Dummy value, replace with actual value from the function above

        return {
          ...container,
          sensors: sensorsForContainer,
          fillLevel: fillLevel,
        };
      });

      //return the containers with sensors and fill level
      return containersWithSensorsAndFillLevel;
    },
  ),
});
