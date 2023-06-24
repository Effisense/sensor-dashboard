import { LatLngExpression } from "leaflet";
import { ReactNode } from "react";
import { MapContainer, MapContainerProps, TileLayer } from "react-leaflet";

export interface MapProps extends MapContainerProps {
  children: ReactNode;
  center: LatLngExpression;
}

export const Map = ({ center, children, zoom = 13, ...props }: MapProps) => {
  return (
    <MapContainer center={center} zoom={zoom} {...props}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {children}
    </MapContainer>
  );
};
