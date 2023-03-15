import { Sensor } from "@/src/entities";

export * as SensorData from "@/src/schemas/public/SensorData";
export { Knex } from "knex";

const timeseries = {
  Sensor,
};

export default timeseries;
