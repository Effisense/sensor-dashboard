import SensorData from "@acme/api/src/schemas/public/SensorData";
import { Container } from "@acme/db";

export function getFillLevel(timeseries: SensorData, containerType: Container) {
  const fillLevel = 0;
  const binHeightInMillimeters = containerType.binHeightInMillimeters;


  return fillLevel;
}
