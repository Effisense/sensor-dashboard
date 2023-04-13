import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../useGeolocation";
import { mapbox, MapboxMap, MapboxMarker } from "@acme/mapbox";
import { trpc } from "@/utils/trpc";

type SetSensorPositionMapProps = {
  latitude?: number;
  longitude?: number;
};

/**
 * Handles initialization of the map from Mapbox, and updates the sensor marker's position on move.
 *
 * @returns the `ref` to the map container. This is used to render the map, for instance in a `div` element: `<div ref={container} />`.
 */
const useSetSensorPositionMap = ({
  latitude,
  longitude,
}: SetSensorPositionMapProps) => {
  const container = useRef(null);
  const { latitude: geoLocationLat, longitude: geoLocationLong } =
    useGeoLocation();
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

    // Don't initialize map if no geo coordinates are available
    if (!geoLocationLat || !geoLocationLong) {
      return;
    }

    map.current = MapboxMap({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: {
        lat: latitude || geoLocationLat,
        lng: longitude || geoLocationLong,
      },
    });

    const marker = MapboxMarker({
      addTo: map.current,
      latitude: latitude || geoLocationLat,
      longitude: longitude || geoLocationLong,
    });
    setSensorMarker(marker);
  }, [longitude, latitude, geoLocationLat, geoLocationLong]);

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
    latitude: sensorMarker?.getLngLat().lat,
    longitude: sensorMarker?.getLngLat().lng,
    isLoading,
    error,
  };
};

export default useSetSensorPositionMap;
