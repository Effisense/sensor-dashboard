import { db } from "@/lib/knex";
import SensorData from "@/src/schemas/public/SensorData";

export const Sensor = db.from<SensorData, SensorData>("sensor_data");
