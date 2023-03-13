import { MapboxMap, MapboxMarker } from "@/lib/mapbox";
import { useEffect, useRef, useState } from "react";
import useGeoLocation from "./useGeolocation";
import mapbox from "mapbox-gl";
import { MapboxGeocoder } from "@/lib/mapbox";

/**
 * Handles initialization of the map from Mapbox, and updates the sensor marker's position on move.
 *
 * @returns the `ref` to the map container. This is used to render the map, for instance in a `div` element: `<div ref={container} />`.
 */
const useMap = () => {
  const container = useRef(null);
  const { latitude, longitude, error } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [sensorMarker, setSensorMarker] = useState<
    mapbox.Marker | null | undefined
  >(null);
  const [location, setLocation] = useState<string | null>(null);

  MapboxGeocoder.on("result", (event) => {
    // Note that this is a MapboxGeocoder event, not a Mapbox event.
    // The types in this library are not well maintained, so we have to cast the result by trial and error.
    if (
      !event.result.place_name ||
      !event.result.geometry.coordinates ||
      !sensorMarker
    ) {
      return;
    }

    const [lng, lat] = event.result.geometry.coordinates as [number, number];
    const location = event.result.place_name as string;

    setLocation(location);
    sensorMarker.setLngLat({ lng, lat });
  });

  useEffect(() => {
    // Get location name using MapboxGeocoder
    if (!map.current || !sensorMarker) {
      return;
    }

    const location = MapboxGeocoder.getLocationFromLngLat(
      sensorMarker.getLngLat(),
    );
    console.log(location);
  }, [sensorMarker]);

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
  });

  console.log(`location: ${location}`);
  console.log(`sensorMarker: ${sensorMarker?.getLngLat()}`);

  return {
    container,
    geoLocationEnabled: !!error,
    sensorMarker,
    location,
  };
};

export default useMap;
