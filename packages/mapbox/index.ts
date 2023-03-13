import mapboxgl, { LngLat } from "mapbox-gl";
import { green } from "tailwindcss/colors";
import ExternalMapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { MapOptions, MarkerOptions } from "./types";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN as string;

export class InternalMapboxGeocoder extends ExternalMapboxGeocoder {
  constructor() {
    super({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });
  }

  getLocationFromLngLat = ({ lng, lat }: LngLat) => {
    const res = this.query(`${lng},${lat}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawData = (res as any).lastSelected as string;
    console.log(rawData);
  };
}

export const MapboxGeocoder = new InternalMapboxGeocoder();

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

export const MapboxMarker = ({ latitude, longitude, addTo }: MarkerOptions) =>
  new mapboxgl.Marker({
    color: green[500],
  })
    .setLngLat({
      lat: latitude,
      lng: longitude,
    })
    .addTo(addTo);

export * from "./types";
export { mapboxgl as mapbox };
