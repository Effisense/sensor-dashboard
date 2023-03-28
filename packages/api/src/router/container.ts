import { TRPCError } from "@trpc/server";
import {
  ContainerIdSchema,
  ContainerSchema,
  CreateContainerSchema,
} from "../schemas/container";
import { protectedProcedure, router } from "../trpc";

export const containerRouter = router({
  create: protectedProcedure
    .input(CreateContainerSchema)
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
      const { containerTypeId } = input;

      return ctx.prisma.container.findUnique({
        where: {
          id: containerTypeId,
        },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.auth.organizationId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Organization not found",
      });
    }

    return ctx.prisma.container.findMany({
      where: {
        organizationId: ctx.auth.organizationId,
      },
    });
  }),

  update: protectedProcedure
    .input(ContainerSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        containerTypeId,
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

      return ctx.prisma.container.update({
        where: {
          id: containerTypeId,
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
      const { containerTypeId } = input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      // TODO: Check if container type is in use by container / sensor. If so, set sensor's containerType to null.

      return ctx.prisma.container.delete({
        where: {
          id: containerTypeId,
        },
      });
    }),
});