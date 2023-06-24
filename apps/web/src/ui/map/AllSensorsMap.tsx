import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";
import isBrowser from "@/utils/isBrowser";
import dynamic from "next/dynamic";

const Map = dynamic(
  () => import("@acme/leaflet/src/map").then((module) => module.Map),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

const Marker = dynamic(
  () => import("@acme/leaflet/src/marker").then((module) => module.Marker),
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
  // const { container, isLoading } = useAllSensorsMap({
  //   sensorsWithFillLevel,
  //   searchBar,
  // });

  return (
    <div className="relative h-full w-full bg-slate-50">
      {isBrowser() && (
        <Map
          center={{
            lat: 51.505,
            lng: -0.09,
          }}
          zoom={13}
          className="relative h-[inherit] w-[inherit] rounded-lg shadow-lg"
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
