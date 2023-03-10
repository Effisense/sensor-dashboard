import mapboxgl from "mapbox-gl";

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

interface Options extends mapboxgl.MapboxOptions {
  style: MapboxStyle;
}

export const MapboxMap = ({ container, style }: Options) =>
  new mapboxgl.Map({
    container,
    style,
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
  }).addControl(new mapboxgl.NavigationControl());
