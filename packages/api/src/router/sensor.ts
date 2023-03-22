import { getLocationFromLngLat } from "@acme/mapbox";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const sensorRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        deviceId: z.string(),
        collectionId: z.string(),
        name: z.string(),
        description: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        containerId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        deviceId,
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
          id: deviceId,
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
});
