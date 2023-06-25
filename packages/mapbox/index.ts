import mapboxgl from "mapbox-gl";
import { LngLatLiteral } from "@mapbox/mapbox-gl-geocoder";
import { GeocoderResponse } from "./types";
import axios from "axios";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN as string;

export const getLocationFromLngLat = async ({
  longitude,
  latitude,
}: LngLatLiteral) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN;

  if (!token) throw new Error("Token not found");

  const data = await axios
    .get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?limit=1&access_token=${
        token as string
      }`,
    )
    .then((res) => res.data as Promise<GeocoderResponse>);

  return data.features[0]?.place_name;
};

export * from "./types";
export { mapboxgl as mapbox };
