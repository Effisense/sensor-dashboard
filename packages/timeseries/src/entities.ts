import { db } from "../lib/kysely";

export const Sensor = db.selectFrom("sensor_data");
