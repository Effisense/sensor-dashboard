import useErrorToast from "@/hooks/toast/useErrorToast";
import { useToast } from "@/hooks/toast/useToast";
import useMap from "@/hooks/useMap";
import { trpc } from "@/utils/trpc";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import Subtle from "./typography/Subtle";

const SensorPositionMap = () => {
  // TODO: Handle the case where geolocation is not enabled. Let the user know that they need to enable it.
  const { container, sensorMarker } = useMap();

  const { data, isLoading, error, refetch } =
    trpc.map.getLocationFromLngLat.useQuery(
      {
        longitude: sensorMarker?.getLngLat().lng,
        latitude: sensorMarker?.getLngLat().lat,
      },
      {
        enabled: !!sensorMarker?.getLngLat(),
      },
    );

  useEffect(() => {
    refetch();
  }, [refetch, sensorMarker]);

  // useErrorToast({ error });

  return (
    <div>
      <div className="h-72 w-72" id="map">
        <div ref={container} className="w-full" />
      </div>
      <div className="py-8">
        {isLoading && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && !error && data && (
          <div className="flex items-center justify-center">
            <Subtle>{data}</Subtle>
          </div>
        )}
      </div>
    </div>
  );
};

export default SensorPositionMap;
