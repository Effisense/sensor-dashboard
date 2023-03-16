import SensorData from "../src/schemas/public/SensorData";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

type Database = {
  sensor_data: SensorData;
};

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      database: process.env.TIMESERIES_DB_NAME,
      port: Number(process.env.TIMESERIES_DB_PORT),
      user: process.env.TIMESERIES_DB_USERNAME,
      host: process.env.TIMESERIES_DB_HOST,
      password: process.env.TIMESERIES_DB_PASSWORD,
    }),
  }),
});
