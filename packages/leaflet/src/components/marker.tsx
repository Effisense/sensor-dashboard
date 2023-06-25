import { LatLngExpression, icon } from "leaflet";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import {
  MarkerProps as _MarkerProps,
  Marker as _Marker,
  useMap,
} from "react-leaflet";
import { Coordinate } from "../types";

export interface MarkerProps extends _MarkerProps {
  children?: ReactNode;
  color?: string;
  popup?: ReactNode;
}

export const Marker = ({
  children,
  position,
  color,
  popup,
  ...props
}: MarkerProps) => {
  const MarkerIcon = icon({
    iconUrl: "/marker.svg",
    iconSize: [32, 32],
  });

  return (
    <_Marker position={position} icon={MarkerIcon} {...props}>
      {children}

      {popup}
    </_Marker>
  );
};

interface SetPositionMarkerProps extends Omit<MarkerProps, "position"> {
  position: Coordinate;
  setPosition: Dispatch<SetStateAction<Coordinate | null>>;
  refetchLocation?: () => Promise<void>;
}

export const SetPositionMarker = ({
  position,
  setPosition,
  refetchLocation,
  children,
  popup,
  ...props
}: SetPositionMarkerProps) => {
  const map = useMap();

  map.on("move", () => {
    setPosition({
      lat: map.getCenter().lat,
      lng: map.getCenter().lng,
    });
  });

  map.on("moveend", async () => {
    if (refetchLocation !== undefined) {
      await refetchLocation();
    }
  });

  return (
    <Marker position={position} {...props}>
      {children}
      {popup}
    </Marker>
  );
};
