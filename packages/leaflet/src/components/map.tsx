import { LatLngBounds, LatLngExpression } from "leaflet";
import { ReactNode, useEffect } from "react";
import {
  MapContainer,
  MapContainerProps,
  TileLayer,
  useMap,
} from "react-leaflet";
import getBounds from "../utils/getBounds";

export interface FitToBoundsProps {
  bounds: LatLngBounds;
}

const FitToBounds = ({ bounds }: FitToBoundsProps) => {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds.toBBoxString()]);

  return null;
};

export interface MapProps extends MapContainerProps {
  children: ReactNode;
  center: LatLngExpression;
  coordinates: LatLngExpression[];
  boundsFallback: LatLngExpression;
}

export const Map = ({
  center,
  children,
  zoom = 13,
  coordinates,
  boundsFallback,
  ...props
}: MapProps) => {
  const bounds = getBounds({
    coordinates,
    fallback: boundsFallback,
  });

  return (
    <MapContainer center={center} zoom={zoom} {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
      <FitToBounds bounds={bounds} />
    </MapContainer>
  );
};
