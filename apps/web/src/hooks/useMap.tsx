import { MapboxMap, MapboxMarker } from "@/lib/mapbox";
import { useEffect, useRef, useState } from "react";
import useGeoLocation from "./useGeolocation";
import mapbox from "mapbox-gl";

/**
 * Handles initialization of the map from Mapbox, and updates the sensor marker's position on move.
 *
 * @returns the `ref` to the map container. This is used to render the map, for instance in a `div` element: `<div ref={container} />`.
 */
const useMap = () => {
  const container = useRef(null);
  const { latitude, longitude, error } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [sensorMarker, setSensorMarker] = useState<mapbox.Marker | null>(null);

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
      if (!map.current) {
        return;
      }

      const { lng, lat } = map.current.getCenter();
      sensorMarker?.setLngLat([lng, lat]);
    });
  });

  return {
    container,
    geoLocationEnabled: !!error,
  };
};

export default useMap;
