import { MapboxMap, MapboxMarker } from "@/lib/mapbox";
import mapbox from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef<mapbox.Map | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [sensorMarker, setSensorMarker] = useState<mapbox.Marker | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLongitude(position.coords.longitude);
        setLatitude(position.coords.latitude);
      },
      (error) => {
        // TODO: Handle error where user denies location.
        // Let user know that they need to allow location to use the app.
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

    MapboxMarker({
      addTo: map.current,
      latitude,
      longitude,
      isCenter: true,
    });
  });

  map.current?.on("mouseup", (event) => {
    if (!map.current) {
      return;
    }

    MapboxMarker({
      addTo: map.current,
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng,
    });
  });

  map.current?.on("load", () => {
    console.log("map loaded");
  });

  return (
    <div className="h-96 w-96" id="map">
      <div ref={mapContainer} className="w-full" />
    </div>
  );
};

export default Map;
