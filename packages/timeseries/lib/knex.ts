import knex from "knex";

export const Knex = knex({
  client: "pg",
  connection: {
    host: process.env.TIMESERIES_DB_HOST,
    port: Number(process.env.TIMESERIES_DB_PORT),
    user: process.env.TIMESERIES_DB_USERNAME,
    password: process.env.TIMESERIES_DB_PASSWORD,
    database: process.env.TIMESERIES_DB_NAME,
  },
});
