import useMap from "@/hooks/useMap";

const Map = () => {
  // TODO: Handle the case where geolocation is not enabled. Let the user know that they need to enable it.
  const { container, geoLocationEnabled, sensorMarker, location } = useMap();

  return (
    <div className="h-96 w-96" id="map">
      <div ref={container} className="w-full" />
    </div>
  );
};

export default Map;
