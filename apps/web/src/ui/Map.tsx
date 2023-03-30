import useMap from "@/hooks/useMap";
import { trpc } from "@/utils/trpc";

const CreateSensorMap = () => {
  // TODO: Handle the case where geolocation is not enabled. Let the user know that they need to enable it.
  const { container, geoLocationEnabled, sensorMarker, location } = useMap();

  const { data, error } = trpc.map.getLocationFromLngLat.useQuery({
    longitude: sensorMarker?.getLngLat().lng || 0,
    latitude: sensorMarker?.getLngLat().lat || 0,
  });

  return (
    <div>
      <div className="h-96 md:h-[calc(100vh-8rem)]" id="map">
        <div ref={container} className="" />
      </div>

      {/* <p className="my-12">
        {!data && !error ? `Loading...` : `Location: ${data}`}
      </p> */}
    </div>
  );
};

export default CreateSensorMap;
