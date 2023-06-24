import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";
import isBrowser from "@/utils/isBrowser";
import dynamic from "next/dynamic";
import useGeoLocation from "@/hooks/useGeolocation";
import RotateSpinner from "../RotateSpinner";

const Map = dynamic(
  () => import("@acme/leaflet").then((mod) => mod.Components.Map),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

const Marker = dynamic(
  () => import("@acme/leaflet").then((mod) => mod.Components.Marker),
  {
    ssr: false,
  },
);

type AllSensorsMapProps = {
  sensor: Sensor | undefined;
  fillLevel: number | null;
}[];

type AllSensorsMapComponentProps = {
  sensorsWithFillLevel: AllSensorsMapProps;
  searchBar?: boolean;
};

const AllSensorsMap = ({
  sensorsWithFillLevel,
  searchBar = true,
}: AllSensorsMapComponentProps) => {
  const { container, isLoading } = useAllSensorsMap({
    sensorsWithFillLevel,
    searchBar,
  });

  const coordinates: [number, number][] = sensorsWithFillLevel
    .filter((sensor) => !!sensor.sensor)
    .map((_sensor) => {
      // We can safely cast this because we filter out null sensors above
      const sensor = _sensor.sensor as Sensor;
      return [sensor.latitude, sensor.longitude];
    });

  const { latitude, longitude } = useGeoLocation();

  const shouldRenderMap = isBrowser() && latitude && longitude;

  return (
    <div className="relative h-full w-full bg-slate-50">
      {shouldRenderMap ? (
        <Map
          center={{
            lat: 51.505,
            lng: -0.09,
          }}
          className="relative h-[inherit] w-[inherit] rounded-lg shadow-lg"
          boundsFallback={{
            lat: latitude || 51.505,
            lng: longitude || -0.09,
          }}
          coordinates={coordinates}
        >
          {sensorsWithFillLevel.map((sensor) => {
            if (!sensor.sensor) return null;
            return (
              <Marker
                key={sensor.sensor.id}
                position={{
                  lat: sensor.sensor.latitude,
                  lng: sensor.sensor.longitude,
                }}
              />
            );
          })}
        </Map>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <RotateSpinner loading={true} />
          <span className="animate-pulse text-sm">Generating your map...</span>
        </div>
      )}
      {/* {!!container ? (
        <div
          className="relative h-[inherit] w-[inherit] rounded-lg shadow-lg"
          id="map"
        >
          <div ref={container} className="h-full w-full rounded-lg" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )} */}
    </div>
  );
};

export default AllSensorsMap;
