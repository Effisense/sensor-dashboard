import { Knex } from "../lib/knex";
import SensorData from "./schemas/public/SensorData";

export const Sensors = Knex.from<SensorData, SensorData>("sensor_data");
