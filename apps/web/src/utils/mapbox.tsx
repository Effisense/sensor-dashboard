import SensorMarkerPopover from "@/ui/map/SensorMarkerPopover";
import { Sensor } from "@acme/db";
import ReactDOM from "react-dom";

type AllSensorsMapProps = {
  sensor: Sensor | undefined;
  fillLevel: number | null;
};

type AllSensorsMapComponentProps = {
  sensorWithFill: AllSensorsMapProps;
};

export const createPopupNode = ({
  sensorWithFill,
}: AllSensorsMapComponentProps) => {
  const popupNode = document.createElement("div");

  ReactDOM.render(
    <SensorMarkerPopover
      title={sensorWithFill.sensor?.name || "Ingen navn"}
      content={sensorWithFill.sensor?.description || "Ingen beskrivelse"}
      link={`sensors/${sensorWithFill.sensor?.id}`}
      linkLabel="See more"
      fillLevel={sensorWithFill.fillLevel}
    />,
    popupNode,
  );

  return popupNode;
};
