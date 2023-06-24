import { icon } from "leaflet";
import { ReactNode } from "react";
import { MarkerProps as _MarkerProps, Marker as _Marker } from "react-leaflet";

export interface MarkerProps extends _MarkerProps {
  children?: ReactNode;
  color?: string;
}

export const Marker = ({
  children,
  position,
  color,
  ...props
}: MarkerProps) => {
  const MarkerIcon = icon({
    iconUrl: "/marker.svg",
    iconSize: [32, 32],
  });

  return (
    <_Marker position={position} icon={MarkerIcon} {...props}>
      {children}
    </_Marker>
  );
};
