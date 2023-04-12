import SensorMarkerPopover from "@/ui/map/SensorMarkerPopover";
import { Sensor } from "@acme/db";
import ReactDOM from "react-dom";

type CreatePopupNodeProps = {
  sensor: Sensor;
};

export const createPopupNode = ({ sensor }: CreatePopupNodeProps) => {
  const popupNode = document.createElement("div");

  ReactDOM.render(
    <SensorMarkerPopover
      title={sensor.name}
      content={sensor.location}
      link={`sensors/${sensor.id}`}
      linkLabel="See more"
    />,
    popupNode,
  );

  return popupNode;
};
