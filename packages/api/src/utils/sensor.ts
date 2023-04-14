import axios from "axios";

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

  return await axios
    .get(
      `https://api.lab5e.com/span/collections/${collectionId}/devices/${deviceId}`,
      {
        headers: {
          Accept: "application/json",
          "X-API-Token": process.env.SPAN_API_TOKEN,
        },
      },
    )
    .then((res) => res.status === 200)
    .catch(() => false);
};
