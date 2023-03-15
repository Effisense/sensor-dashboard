import { db } from "../lib/knex";
import SensorData from "./schemas/public/SensorData";

export const Sensor = db.from<SensorData, SensorData>("sensor_data");
