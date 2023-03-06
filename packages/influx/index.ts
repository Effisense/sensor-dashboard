import { InfluxDB } from "@influxdata/influxdb-client";

export const influx = new InfluxDB({
  url: process.env.INFLUX_URL as string,
  token: process.env.INFLUX_TOKEN as string,
});

export * from "./types";
