import mapboxgl from "mapbox-gl";
import { red, slate } from "tailwindcss/colors";

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

export const MapboxMap = ({ container, style, center, zoom }: MapOptions) =>
  new mapboxgl.Map({
    container,
    style,
    center,
    zoom: zoom || 13,
  })
    .addControl(new mapboxgl.NavigationControl())
    .addControl(new mapboxgl.FullscreenControl())
    .addControl(new mapboxgl.GeolocateControl());

interface MarkerOptions extends mapboxgl.MarkerOptions {
  latitude: number;
  longitude: number;
  addTo: mapboxgl.Map;
  isCenter?: boolean;
}

export const MapboxMarker = ({
  latitude,
  longitude,
  addTo,
  isCenter = false,
}: MarkerOptions) =>
  new mapboxgl.Marker({
    color: isCenter ? red[400] : slate[400],
    draggable: !isCenter,
  })
    .setLngLat({
      lat: latitude,
      lng: longitude,
    })
    .addTo(addTo);
