import { icon } from "leaflet";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  MarkerProps as _MarkerProps,
  Marker as _Marker,
  useMap,
} from "react-leaflet";
import { Coordinate } from "../types";

const getIconUrl = (status: MarkerProps["status"]) => {
  switch (status) {
    case "success":
      return "/markers/green.svg";
    case "error":
      return "/markers/red.svg";
    case "warning":
      return "/markers/orange.svg";
    default:
      return "/markers/neutral.svg";
  }
};

export interface MarkerProps extends _MarkerProps {
  children?: ReactNode;
  status?: "success" | "error" | "neutral" | "warning";
  popup?: ReactNode;
}

export const Marker = ({
  children,
  position,
  status = "neutral",
  popup,
  ...props
}: MarkerProps) => {
  const iconUrl = getIconUrl(status);

  const MarkerIcon = icon({
    iconUrl,
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
}

export const SetPositionMarker = ({
  position,
  setPosition,
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

  return (
    <Marker position={position} {...props}>
      {children}
      {popup}
    </Marker>
  );
};
