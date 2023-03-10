import { MapboxMap } from "@/lib/mapbox";
import * as Mapbox from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<Mapbox.Map | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
        console.log(position.coords);
      },
      (error) => {
        console.log(error);
      },
    );
  }, []);

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
  });

  console.log(map.current?.getCenter());

  return (
    <div className="h-96 w-96" id="map">
      <div ref={mapContainer} className="w-full" />
    </div>
  );
};

export default Map;
