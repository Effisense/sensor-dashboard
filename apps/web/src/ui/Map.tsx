import useMap from "@/hooks/useMap";
import { trpc } from "@/utils/trpc";

const Map = () => {
  // TODO: Handle the case where geolocation is not enabled. Let the user know that they need to enable it.
  const { container, geoLocationEnabled, sensorMarker, location } = useMap();

  const { data, error } = trpc.map.getLocationFromLngLat.useQuery({
    lng: sensorMarker?.getLngLat().lng || 0,
    lat: sensorMarker?.getLngLat().lat || 0,
  });

  return (
    <div>
      <div className="h-96 w-96" id="map">
        <div ref={container} className="w-full" />
      </div>
      <p className="my-12">
        {!data && !error ? `Loading...` : `Location: ${data}`}
      </p>
    </div>
  );
};

export default Map;