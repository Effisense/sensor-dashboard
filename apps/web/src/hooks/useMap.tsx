import { useEffect, useRef, useState } from "react";
import useGeoLocation from "./useGeolocation";
import { mapbox, MapboxMap, MapboxMarker } from "@acme/mapbox";
import { trpc } from "@/utils/trpc";

/**
 * Handles initialization of the map from Mapbox, and updates the sensor marker's position on move.
 *
 * @returns the `ref` to the map container. This is used to render the map, for instance in a `div` element: `<div ref={container} />`.
 */
const useMap = () => {
  const container = useRef(null);
  const { latitude, longitude } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [sensorMarker, setSensorMarker] = useState<mapbox.Marker | null>(null);
  const {
    data,
    isLoading: locationIsLoading,
    error,
    refetch,
  } = trpc.map.getLocationFromLngLat.useQuery(
    {
      longitude: sensorMarker?.getLngLat().lng,
      latitude: sensorMarker?.getLngLat().lat,
    },
    {
      enabled: !!sensorMarker?.getLngLat(),
    },
  );

  // Initialize map
  useEffect(() => {
    if (map.current) {
      return;
    }

    if (!longitude || !latitude) {
      return;
    }

    map.current = MapboxMap({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: {
        lat: latitude,
        lng: longitude,
      },
    });

    const marker = MapboxMarker({
      addTo: map.current,
      latitude,
      longitude,
    });
    setSensorMarker(marker);
  }, [longitude, latitude]);

  // Update sensor marker's position when map is moved
  useEffect(() => {
    if (!map.current) {
      return;
    }

    map.current.on("move", () => {
      if (!map.current || !sensorMarker) {
        return;
      }

      const { lng, lat } = map.current.getCenter();
      sensorMarker.setLngLat({ lng, lat });
    });

    map.current.on("moveend", () => {
      setSensorMarker(sensorMarker);
      refetch();
    });
  });

  const isLoading = map.current?.isMoving() || locationIsLoading;

  return {
    container,
    data,
    isLoading,
    error,
  };
};

export default useMap;
