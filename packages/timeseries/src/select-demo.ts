import { Knex } from "../lib/knex";

export const SELECT_ALL_FROM_SENSOR_DATA_ORDER_BY_TIME = Knex.select("*")
  .from("sensor_data")
  .orderBy("time");
