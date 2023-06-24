import { icon } from "leaflet";
import { ReactNode } from "react";
import { MarkerProps as _MarkerProps, Marker as _Marker } from "react-leaflet";

export const MarkerIcon = icon({
  iconUrl: "/marker.svg",
  iconSize: [32, 32],
});

export interface MarkerProps extends _MarkerProps {
  children?: ReactNode;
}

export const Marker = ({ children, position, ...props }: MarkerProps) => {
  return (
    <_Marker position={position} icon={MarkerIcon} {...props}>
      {children}
    </_Marker>
  );
};
