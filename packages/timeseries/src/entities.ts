import { db } from "../lib/kysely";

export const Sensor = db.selectFrom("sensor");

console.log(Sensor.select("battery").execute());
