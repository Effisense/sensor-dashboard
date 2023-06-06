import { Container } from "@acme/db";
import axios from "axios";
import SensorData from "../schemas/public/SensorData";

/**
 * Checks if a sensor belongs to a collection by using the SPAN API, the IoT platform used by Lab5e.
 *
 * @param deviceId is the sensor's ID
 * @param collectionId is the collection's ID
 * @returns a boolean determining if the sensor belongs to the collection
 */
export const sensorBelongsToCollection = async (
  deviceId?: string,
  collectionId?: string,
) => {
  if (!deviceId || !collectionId) return false;

  const result = await axios.get(
    `https://api.lab5e.com/span/collections/${collectionId}/devices/${deviceId}`,
    {
      headers: {
        Accept: "application/json",
        "X-API-Token": process.env.SPAN_API_TOKEN,
      },
    },
  );
  // .then((res) => res.status === 200)
  // .catch(() => false);
  return result.status === 200;
};

type FillLevelProps = {
  timeseries?: SensorData;
  container: Container | null;
};

export enum TimeseriesStatus {
  RANGE_DATA_NOT_UPDATED = 0,
  SIGNAL_RATE_TOO_LOW_FOR_SPAD = 1,
  TARGET_PHASE = 2,
  SIGMA_ESTIMATOR_TOO_HIGH = 3,
  TARGET_CONSISTENCY_FAILED = 4,
  RANGE_VALID = 5,
  WRAP_AROUND_NOT_PERFORMED = 6,
  RATE_CONSISTENCY_FAILED = 7,
  SIGNAL_RATE_TOO_FOR_TARGET = 8,
  RANGE_VALID_WITH_LARGE_PULSE = 9,
  RANGE_VALID_NO_PREVIOUS_TARGET_DETECTED = 10,
  MEASUREMENT_CONSISTENCY_FAILED = 11,
  TARGET_BLURRED = 12,
  TARGET_DETECTED_BUT_INCONSISTENT_DATA = 13,
  NO_TARGET_DETECTED = 14,
}

const isValidStatus = (status: number | null) => {
  const validTimeseriesStatuses = [
    TimeseriesStatus.RANGE_VALID,
    TimeseriesStatus.WRAP_AROUND_NOT_PERFORMED,
    TimeseriesStatus.RANGE_VALID_WITH_LARGE_PULSE,
    TimeseriesStatus.RANGE_VALID_NO_PREVIOUS_TARGET_DETECTED,
  ];

  return status !== null && validTimeseriesStatuses.includes(status);
};

export const getFillLevel = ({
  timeseries,
  container,
}: FillLevelProps): number | null => {
  if (!timeseries || !container) return null;

  const middleDistances = [
    isValidStatus(timeseries.status_z5) ? timeseries.dist_z5 : null,
    isValidStatus(timeseries.status_z6) ? timeseries.dist_z6 : null,
    isValidStatus(timeseries.status_z9) ? timeseries.dist_z9 : null,
    isValidStatus(timeseries.status_z10) ? timeseries.dist_z10 : null,
  ];

  const distances: number[] = middleDistances.filter(
    (point): point is number => point !== null,
  );

  if (distances.length === 0) return null;

  const meanOfDistances =
    distances.reduce((a, b) => a + b, 0) / distances.length;

  const sensorOffset = container.sensorOffsetInMillimeters ?? 0;
  const binHeight = container.binHeightInMillimeters;
  const range = binHeight - sensorOffset;

  const fillLevel = ((meanOfDistances - sensorOffset) / range) * 100;
  return Math.min(Math.max(0, fillLevel), 100);
};
