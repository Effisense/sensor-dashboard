export interface GeocoderResponse {
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
