import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getLocationFromLngLat } from "@acme/mapbox";

export const mapRouter = router({
  getLocationFromLngLat: protectedProcedure
    .input(
      z.object({
        longitude: z.number().optional(),
        latitude: z.number().optional(),
      }),
    )
    .query(async ({ input: { longitude, latitude } }) => {
      if (!longitude || !latitude) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid coordinates",
        });
      }

      const location = await getLocationFromLngLat({
        longitude,
        latitude,
      }).catch((err) => {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      });

      return location;
    }),
});
