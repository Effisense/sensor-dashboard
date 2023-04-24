import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../useGeolocation";
import { mapbox, MapboxMap, MapboxMarker, MapboxPopup } from "@acme/mapbox";
import { slate } from "tailwindcss/colors";
import { Sensor } from "@acme/db";
import { createPopupNode } from "@/utils/mapbox";
import percentToColorTremor, {
  percentToColorHex,
} from "@/utils/percentToColor";
import { LngLatBounds } from "mapbox-gl";
import { centroid, distance } from "@turf/turf";

type AllSensorsMapProps = {
  sensor: Sensor | undefined;
  fillLevel: number | null;
}[];

type AllSensorsMapComponentProps = {
  sensorWithFill: AllSensorsMapProps;
};

const useAllSensorsMap = ({ sensorWithFill }: AllSensorsMapComponentProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [sensorMarkers, setSensorMarkers] = useState<(mapbox.Marker | null)[]>(
    [],
  );

  useEffect(() => {
    if (!map.current) return;
    map.current.triggerRepaint();
  }, [sensorWithFill]);

  useEffect(() => {
    if (map.current || !sensorWithFill) return;
    if (!longitude || !latitude) return;
    if (!container.current) return;
    if (isNaN(longitude) || isNaN(latitude)) return;

    map.current = MapboxMap({
      container: container.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [longitude, latitude],
      zoom: 10,
    });

    const onMapLoad = () => {
      const bounds = new LngLatBounds();
      const markers = sensorWithFill.map((sensorWithFill) => {
        if (!map.current || !sensorWithFill.sensor) return null;
        const popup = MapboxPopup({
          html: createPopupNode({ sensorWithFill }),
        });

        // Add the sensor's position to the bounds
        bounds.extend([
          sensorWithFill.sensor.longitude,
          sensorWithFill.sensor.latitude,
        ]);

        return MapboxMarker({
          latitude: sensorWithFill.sensor.latitude,
          longitude: sensorWithFill.sensor.longitude,
          color: percentToColorHex(sensorWithFill.fillLevel),
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
      setLoading(false);
    };

    map.current.on("load", onMapLoad);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [longitude, latitude, sensorWithFill]);

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

  const isLoading = loading;

  return {
    container,
    isLoading,
  };
};

export default useAllSensorsMap;
