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
    timeseries.dist_z5,
    timeseries.dist_z6,
    timeseries.dist_z9,
    timeseries.dist_z10,
  ];

  const points: number[] = middlePoints.filter(
    (point): point is number => point !== null,
  );

  if (points.length === 0) return null;

  points.sort((a, b) => a - b);

  const hasEvenNumberOfPoints = points.length % 2 === 0;

  const left = points[points.length / 2 - 1];
  const right = points[points.length / 2];

  if (!left || !right) return null;

  const median = hasEvenNumberOfPoints
    ? (left + right) / 2
    : points[Math.floor(points.length / 2)];

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
