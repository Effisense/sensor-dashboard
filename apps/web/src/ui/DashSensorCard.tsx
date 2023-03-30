import { Sensor } from "@acme/db";

function DashSensorCard(sensor: Sensor) {
  return (
    <div>
      <h1>{sensor.description}</h1>
    </div>
  );
}

export default DashSensorCard;
