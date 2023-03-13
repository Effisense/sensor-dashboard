import useMap from "@/hooks/useMap";
import { trpc } from "@/utils/trpc";

const Map = () => {
  // TODO: Handle the case where geolocation is not enabled. Let the user know that they need to enable it.
  const { container, geoLocationEnabled, sensorMarker, location } = useMap();

  const { data } = trpc.map.getLocationFromLngLat.useQuery({
    lng: sensorMarker?.getLngLat().lng || 0,
    lat: sensorMarker?.getLngLat().lat || 0,
  });

  console.log(data);

  return (
    <div className="h-96 w-96" id="map">
      <div ref={container} className="w-full" />
    </div>
  );
};

export default Map;
