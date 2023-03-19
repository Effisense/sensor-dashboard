import mapboxgl, { LngLat, LngLatLike } from "mapbox-gl";
import { green } from "tailwindcss/colors";
import ExternalMapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_PUBLIC_TOKEN as string;

type MapboxStyle =
  | "mapbox://styles/mapbox/streets-v12"
  | "mapbox://styles/mapbox/outdoors-v12"
  | "mapbox://styles/mapbox/light-v11"
  | "mapbox://styles/mapbox/dark-v11"
  | "mapbox://styles/mapbox/satellite-v9"
  | "mapbox://styles/mapbox/satellite-streets-v12"
  | "mapbox://styles/mapbox/navigation-day-v1"
  | "mapbox://styles/mapbox/navigation-night-v1";

interface MapOptions extends mapboxgl.MapboxOptions {
  center: mapboxgl.LngLatLike;
  style: MapboxStyle;
}

class InternalMapboxGeocoder extends ExternalMapboxGeocoder {
  constructor() {
    super({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });
  }

  getLocationFromLngLat = ({ lng, lat }: LngLat) => {
    const result = this.query(`${lng},${lat}`);
    console.log(result);
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

interface MarkerOptions extends mapboxgl.MarkerOptions {
  latitude: number;
  longitude: number;
  addTo: mapboxgl.Map;
  isCenter?: boolean;
}

export const MapboxMarker = ({ latitude, longitude, addTo }: MarkerOptions) =>
  new mapboxgl.Marker({
    color: green[500],
  })
    .setLngLat({
      lat: latitude,
      lng: longitude,
    })
    .addTo(addTo);
