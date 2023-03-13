import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { MapboxGeocoderResponse } from "@acme/mapbox";

export const mapRouter = router({
  getLocationFromLngLat: protectedProcedure
    .input(
      z.object({
        lng: z.number().optional(),
        lat: z.number().optional(),
      }),
    )
    .query(async ({ input: { lng, lat } }) => {
      if (!lng || !lat) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid coordinates",
        });
      }

      const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Token not found",
        });
      }

      const data = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?limit=1&access_token=${
          token as string
        }`,
      ).then((res) => res.json() as Promise<MapboxGeocoderResponse>);

      return data.features[0]?.place_name;
    }),
});
