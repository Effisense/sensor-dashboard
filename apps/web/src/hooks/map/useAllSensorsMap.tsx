import { useCallback, useEffect, useRef, useState } from "react";
import useGeoLocation from "../useGeolocation";
import { mapbox, MapboxMap, MapboxMarker, MapboxPopup } from "@acme/mapbox";
import { createPopupNode } from "@/utils/mapbox";
import { percentToColorHex } from "@/utils/percentToColor";
import { LngLatBounds } from "mapbox-gl";
import { SensorWithFillLevel } from "@/types";

type AllSensorsMapProps = {
  sensorsWithFillLevel: SensorWithFillLevel[];
};

const useAllSensorsMap = ({ sensorsWithFillLevel }: AllSensorsMapProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sensorMarkers, setSensorMarkers] = useState<(mapbox.Marker | null)[]>(
    [],
  );

  const onMapLoad = useCallback(() => {
    const bounds = new LngLatBounds();
    const markers = sensorsWithFillLevel.map((sensorWithFillLevel) => {
      if (!map.current || !sensorWithFillLevel.sensor) return null;
      const popup = MapboxPopup({
        html: createPopupNode({ sensorWithFillLevel }),
      });

      // Add the sensor's position to the bounds
      bounds.extend([
        sensorWithFillLevel.sensor.longitude,
        sensorWithFillLevel.sensor.latitude,
      ]);

      return MapboxMarker({
        latitude: sensorWithFillLevel.sensor.latitude,
        longitude: sensorWithFillLevel.sensor.longitude,
        color: percentToColorHex(sensorWithFillLevel.fillLevel),
        addTo: map.current,
      }).setPopup(popup);
    });

    setSensorMarkers(markers);

    // TODO: Fix padding so that the map is not zoomed in too much. Needs a new implementation
    if (map.current && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 200,
      });
    }
    setIsLoading(false);
  }, [sensorsWithFillLevel]);

  useEffect(() => {
    if (map.current || !sensorsWithFillLevel) return;
    if (!longitude || !latitude) return;
    if (!container.current) return;
    // TODO: This still doesn't work all the time
    if (isNaN(longitude) || isNaN(latitude)) return;

    map.current = MapboxMap({
      container: container.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [longitude, latitude],
      zoom: 10,
    });

    map.current.on("load", onMapLoad);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [longitude, latitude, sensorsWithFillLevel, onMapLoad]);

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

  return {
    container,
    isLoading,
  };
};

export default useAllSensorsMap;
