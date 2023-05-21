import { Container, Sensor } from "@acme/db";
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

export const getFillLevel = ({
  timeseries,
  container,
}: FillLevelProps): number | null => {
  if (!timeseries || !container) return null;

  const middlePoints = [
    timeseries.status_z5,
    timeseries.status_z6,
    timeseries.status_z9,
    timeseries.status_z10,
  ];

  const validPoints: number[] = middlePoints.filter(
    (point): point is number => point !== null,
  );

  if (validPoints.length === 0) return null;

  validPoints.sort((a, b) => a - b);

  const hasEvenNumberOfPoints = validPoints.length % 2 === 0;

  const left = validPoints[validPoints.length / 2 - 1];
  const right = validPoints[validPoints.length / 2];

  if (!left || !right) return null;

  const median = hasEvenNumberOfPoints
    ? (left + right) / 2
    : validPoints[Math.floor(validPoints.length / 2)];

  if (!median) return null;

  const sensorOffset = container.sensorOffsetInMillimeters ?? 0;
  const binHeight = container.binHeightInMillimeters;

  if (median < sensorOffset) {
    return 100;
  }

  const distanceFromTop = median - sensorOffset;
  const fillLevel = ((binHeight - distanceFromTop) / binHeight) * 100;

  return Math.min(Math.max(0, fillLevel), 100);
};
