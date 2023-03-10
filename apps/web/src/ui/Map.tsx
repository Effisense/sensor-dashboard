import { MapboxMap } from "@/lib/mapbox";
import * as Mapbox from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<Mapbox.Map | null>(null);
  const [longitude, setLongitude] = useState(-70.9);
  const [latitude, setLatitude] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) {
      return;
    }

    map.current = MapboxMap({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v11",
    });
  });

  return (
    <div className="h-96 w-96" id="map">
      <div ref={mapContainer} className="w-full" />
    </div>
  );
};

export default Map;
