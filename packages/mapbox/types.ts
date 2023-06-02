export interface MapboxGeocoderResponse {
  type: string;
  query: number[];
  features: Feature[];
  attribution: string;
}

export interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: Properties;
  text: string;
  place_name: string;
  center: number[];
  geometry: Geometry;
  context: Context[];
}

export interface Context {
  id: string;
  mapbox_id: string;
  text: string;
  wikidata?: string;
  short_code?: string;
}

export interface Geometry {
  coordinates: number[];
  type: string;
}

export interface Properties {
  foursquare: string;
  landmark: boolean;
  address: string;
  category: string;
}

export type MapboxStyle =
  | "mapbox://styles/mapbox/streets-v12"
  | "mapbox://styles/mapbox/outdoors-v12"
  | "mapbox://styles/mapbox/light-v11"
  | "mapbox://styles/mapbox/dark-v11"
  | "mapbox://styles/mapbox/satellite-v9"
  | "mapbox://styles/mapbox/satellite-streets-v12"
  | "mapbox://styles/mapbox/navigation-day-v1"
  | "mapbox://styles/mapbox/navigation-night-v1";

export interface MapOptions extends mapboxgl.MapboxOptions {
  center: mapboxgl.LngLatLike;
  style: MapboxStyle;
  searchBar?: boolean;
}

export interface MarkerOptions extends mapboxgl.MarkerOptions {
  latitude: number;
  longitude: number;
  addTo: mapboxgl.Map;
  color?: string;
  isCenter?: boolean;
}

export interface PopupOptions extends mapboxgl.PopupOptions {
  html: HTMLElement;
}
