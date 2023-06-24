import { ReactNode } from "react";
import { MarkerProps as _MarkerProps, Marker as _Marker } from "react-leaflet";

export interface MarkerProps extends _MarkerProps {
  children?: ReactNode;
}

export const Marker = ({ children, position, ...props }: MarkerProps) => {
  return (
    <_Marker position={position} {...props}>
      {children}
    </_Marker>
  );
};
