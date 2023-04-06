import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../useGeolocation";
import { Marker, MarkerOptions } from "mapbox-gl";
import { mapbox, MapboxMap } from "@acme/mapbox";
import { trpc } from "@/utils/trpc";
import mapboxgl from "mapbox-gl";

const useAllSensorsMap = () => {
  const container = useRef<HTMLDivElement>(null);
  const { latitude, longitude } = useGeoLocation();
  const map = useRef<mapbox.Map | null>(null);
  const [sensorMarkers, setSensorMarkers] = useState<
    ((options: MarkerOptions) => Marker)[]
  >([]);

  //get data from all sensors in the backend
  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error: sensorsError,
  } = trpc.sensor.getAll.useQuery();

  useEffect(() => {
    if (map.current || !sensors) {
      return;
    }

    // if there is no latitude or longitude, do nothing
    if (!longitude || !latitude) {
      return;
    }

    map.current = MapboxMap({
      container: container.current!,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [longitude, latitude],
      zoom: 10,
    });

    const onMapLoad = () => {
      //creates a marker for each location of the sensors in the db
      const markers = sensors.map((sensor) => {
        // create the popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<b>${sensor.name}</b><p>${sensor.location}</p>`)
          .setMaxWidth("210px");
        return (options: MarkerOptions) =>
          new Marker({ ...options, color: "green" })
            .setPopup(popup)
            .setLngLat([sensor.longitude, sensor.latitude])
            .addTo(map.current!);
      });

      //set markers to state
      setSensorMarkers(markers);
    };
    map.current.on("load", onMapLoad);

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [longitude, latitude, sensors]);

  // useEffect hook that updates the position of the markers when the map is moved
  useEffect(() => {
    if (!map.current) {
      return;
    }

    const onMove = () => {
      if (!map.current || sensorMarkers.length === 0) {
        return;
      }

      sensorMarkers.forEach((marker) => {
        const { lng, lat } = marker({}).getLngLat();
        marker({}).setLngLat([lng, lat]);
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
