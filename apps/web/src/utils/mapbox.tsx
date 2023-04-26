import { SensorWithFillLevel } from "@/types";
import SensorMarkerPopover from "@/ui/map/SensorMarkerPopover";
import ReactDOM from "react-dom";

type PopupNodeProps = {
  sensorWithFillLevel: SensorWithFillLevel;
};

export const createPopupNode = ({ sensorWithFillLevel }: PopupNodeProps) => {
  const popupNode = document.createElement("div");

  ReactDOM.render(
    <SensorMarkerPopover
      title={sensorWithFillLevel.sensor?.name || "Ingen navn"}
      content={sensorWithFillLevel.sensor?.description || "Ingen beskrivelse"}
      link={`sensors/${sensorWithFillLevel.sensor?.id}`}
      linkLabel="See more"
      fillLevel={sensorWithFillLevel.fillLevel}
    />,
    popupNode,
  );

  return popupNode;
};
