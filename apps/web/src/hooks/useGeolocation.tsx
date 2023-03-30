import { useEffect, useState } from "react";
import { useToast } from "./toast/useToast";

/**
 * Handles getting the user's current geolocation from the browser.
 *
 * A user may deny access to their location, in which case the `error` property will be set.
 *
 * @returns the user's current longitude, latitude, and error (if any).
 */
const useGeoLocation = () => {
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [error, setError] = useState<GeolocationPositionError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
      },
      (error) => {
        setError(error);
      },
    );
  }, []);

  useEffect(() => {
    if (!!error) {
      toast({
        title: "Oops!",
        description:
          "Geolocation is not enabled. Please enable it to interact with the map.",
        severity: "error",
      });
    }
  }, [error, toast]);

  return { longitude, latitude, error };
};

export default useGeoLocation;
