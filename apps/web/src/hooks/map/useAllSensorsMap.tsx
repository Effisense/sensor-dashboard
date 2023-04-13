import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../useGeolocation";
import { mapbox, MapboxMap, MapboxMarker, MapboxPopup } from "@acme/mapbox";
import { slate } from "tailwindcss/colors";
import { Sensor } from "@acme/db";
import { createPopupNode } from "@/utils/mapbox";

type AllSensorsMapProps = {
  sensors: Sensor[] | undefined;
};

const useAllSensorsMap = ({ sensors }: AllSensorsMapProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [sensorMarkers, setSensorMarkers] = useState<(mapbox.Marker | null)[]>(
    [],
  );

  useEffect(() => {
    if (!map.current) return;
    map.current.triggerRepaint();
  }, [sensors]);

  useEffect(() => {
    if (map.current || !sensors) return;
    if (!longitude || !latitude) return;
    if (!container.current) return;

    map.current = MapboxMap({
      container: container.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [longitude, latitude],
      zoom: 10,
    });

    const onMapLoad = () => {
      const markers = sensors.map((sensor) => {
        if (!map.current) return null;
        const popup = MapboxPopup({ html: createPopupNode({ sensor }) });
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

  const isLoading = map.current?.isMoving() || false;

  return {
    container,
    isLoading,
  };
};

export default useAllSensorsMap;
