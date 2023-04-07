import mapboxgl, { LngLat } from "mapbox-gl";
import { green } from "tailwindcss/colors";
import ExternalMapboxGeocoder, {
  LngLatLiteral,
} from "@mapbox/mapbox-gl-geocoder";
import { MapboxGeocoderResponse, MapOptions, MarkerOptions } from "./types";
import axios from "axios";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN as string;

export const MapboxGeocoder = new ExternalMapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl,
  marker: false,
});

export const MapboxMap = ({ container, style, center, zoom }: MapOptions) =>
  new mapboxgl.Map({
    container,
    style,
    center,
    zoom: zoom || 13,
  })
    .addControl(new mapboxgl.NavigationControl())
    .addControl(new mapboxgl.FullscreenControl())
    .addControl(new mapboxgl.GeolocateControl())
    .addControl(MapboxGeocoder, "top-left");

export const MapboxMarker = ({
  latitude,
  longitude,
  addTo,
  color,
}: MarkerOptions) =>
  new mapboxgl.Marker({
    color: color || green[500],
  })
    .setLngLat({
      lat: latitude,
      lng: longitude,
    })
    .addTo(addTo);

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
    .then((res) => res.data as Promise<MapboxGeocoderResponse>);

  return data.features[0]?.place_name;
};

export * from "./types";
export { mapboxgl as mapbox };
