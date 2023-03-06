import { Bucket, influx as influxDb } from "@acme/influx";

export const influx = {
  query: influxDb.getQueryApi(process.env.INFLUX_ORG as string),
  write: (bucket: Bucket) =>
    influxDb.getWriteApi(process.env.INFLUX_ORG as string, bucket),
};
