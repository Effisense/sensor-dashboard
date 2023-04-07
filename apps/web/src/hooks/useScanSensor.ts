import { trpc } from "@/utils/trpc";
import {
  SpanApiPayload,
  SpanApiPayloadSchema,
} from "@acme/api/src/schemas/sensor";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useToast } from "./toast/useToast";

/**
 * Handles scanning of a sensor QR code.
 *
 * Displays a toast when the sensor is successfully scanned, and redirects to the add sensor page.
 * Displays a toast when the sensor is not successfully scanned.
 *
 * @returns all objects and handlers needed to scan a sensor.
 */
const useScanSensor = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [payload, setPayload] = useState<SpanApiPayload | null>(null);

  const { data: sensorBelongsToCollection, refetch } =
    trpc.sensor.belongsToCollection.useQuery(
      {
        collectionId: payload?.collectionId || "",
        deviceId: payload?.deviceId || "",
      },
      {
        enabled: !!payload,
      },
    );

  /**
   * Handles the scan of a sensor QR code.
   *
   * @param data is the raw data of the QR code, which can be any string in any format.
   */
  const handleScan = (data: string) => {
    console.log("handle scan is run");
    try {
      const payload = SpanApiPayloadSchema.parse(JSON.parse(data));
      setPayload(payload);
      refetch();

      console.log("refetch is run");
    } catch (e) {
      toast({
        title: "Oops!",
        description: "Something went wrong. Are you sure you scanned a sensor?",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    console.log("useEffect is run");
    if (sensorBelongsToCollection && payload) {
      console.log("sensorBelongsToCollection && payload is true");

      toast({
        title: "Success!",
        description: "You will now be redirected to add the sensor.",
        severity: "success",
      });

      router.push({
        pathname: "/sensors/create",
        query: {
          deviceId: payload.deviceId,
          collectionId: payload.collectionId,
        },
      });
    }
  }, [payload, router, sensorBelongsToCollection, toast]);

  return {
    handleScan,
  };
};

export default useScanSensor;
