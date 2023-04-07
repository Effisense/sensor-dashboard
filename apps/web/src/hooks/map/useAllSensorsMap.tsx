import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../useGeolocation";
import { mapbox, MapboxMap, MapboxMarker, MapboxPopup } from "@acme/mapbox";
import { trpc } from "@/utils/trpc";
import { slate } from "tailwindcss/colors";

const useAllSensorsMap = () => {
  const container = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [sensorMarkers, setSensorMarkers] = useState<(mapbox.Marker | null)[]>(
    [],
  );

  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error: sensorsError,
  } = trpc.sensor.getAll.useQuery();

  useEffect(() => {
    if (map.current || !sensors) {
      return;
    }

    if (!longitude || !latitude) {
      return;
    }

    if (!container.current) {
      return;
    }

    map.current = MapboxMap({
      container: container.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 10,
    });

    const onMapLoad = () => {
      const markers = sensors.map((sensor) => {
        if (!map.current) return null;

        // TODO: Can we use shadcn's popup component here?
        const popup = MapboxPopup({
          html: `<b>${sensor.name}</b><p>${sensor.location}</p>`,
        });

        return MapboxMarker({
          latitude: sensor.latitude,
          longitude: sensor.longitude,
          color: slate["400"],
          addTo: map.current,
        }).setPopup(popup);
      });

      setSensorMarkers(markers);
    };
    map.current.on("load", onMapLoad);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [longitude, latitude, sensors]);

  // Updates the position of the markers when the map is moved
  useEffect(() => {
    if (!map.current) {
      return;
    }

    const onMove = () => {
      if (!map.current || sensorMarkers.length === 0) {
        return;
      }

      sensorMarkers.forEach((marker) => {
        if (!marker) return;
        const { lng, lat } = marker.getLngLat();
        marker.setLngLat({ lng, lat });
      });
    };

    map.current.on("move", onMove);

    return () => {
      if (map.current) {
        map.current.off("move", onMove);
      }
    };
  }, [sensorMarkers]);

  const isLoading = map.current?.isMoving() || sensorsIsLoading;

  return {
    container,
    isLoading,
    error: sensorsError,
  };
};

export default useAllSensorsMap;
