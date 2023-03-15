import SensorData from "@/src/schemas/public/SensorData";
import knex, { Knex as IKnex } from "knex";

export const db: IKnex<SensorData, SensorData> = knex({
  client: "pg",
  connection: {
    host: process.env.TIMESERIES_DB_HOST,
    port: Number(process.env.TIMESERIES_DB_PORT),
    user: process.env.TIMESERIES_DB_USERNAME,
    password: process.env.TIMESERIES_DB_PASSWORD,
    database: process.env.TIMESERIES_DB_NAME,
  },
});
