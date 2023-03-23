import { TRPCError } from "@trpc/server";
import {
  ContainerTypeIdSchema,
  ContainerTypeSchema,
  CreateContainerTypeSchema,
} from "../schemas/containerType";
import { protectedProcedure, router } from "../trpc";

export const containerTypeRouter = router({
  create: protectedProcedure
    .input(CreateContainerTypeSchema)
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

      return ctx.prisma.containerType.create({
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
    .input(ContainerTypeIdSchema)
    .query(async ({ ctx, input }) => {
      const { containerTypeId } = input;

      return ctx.prisma.containerType.findUnique({
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

    return ctx.prisma.containerType.findMany({
      where: {
        organizationId: ctx.auth.organizationId,
      },
    });
  }),

  update: protectedProcedure
    .input(ContainerTypeSchema)
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

      return ctx.prisma.containerType.update({
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
    .input(ContainerTypeIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { containerTypeId } = input;

      if (!ctx.auth.organizationId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Organization not found",
        });
      }

      // TODO: Check if container type is in use by container / sensor. If so, set sensor's containerType to null.

      return ctx.prisma.containerType.delete({
        where: {
          id: containerTypeId,
        },
      });
    }),
});
