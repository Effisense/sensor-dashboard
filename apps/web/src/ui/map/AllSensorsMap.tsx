import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";
import isBrowser from "@/utils/isBrowser";
import dynamic from "next/dynamic";
import useGeoLocation from "@/hooks/useGeolocation";
import RotateSpinner from "../RotateSpinner";
import { percentToColorHex } from "@/utils/percentToColor";
import SensorMarkerPopover from "./SensorMarkerPopover";

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

const Popup = dynamic(
  () => import("@acme/leaflet").then((mod) => mod.Components.Popup),
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
  // TODO: Handle search bar in map

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
          {sensorsWithFillLevel.map((sensorWithFillLevel) => {
            if (!sensorWithFillLevel.sensor) return null;
            return (
              <Marker
                key={sensorWithFillLevel.sensor.id}
                position={{
                  lat: sensorWithFillLevel.sensor.latitude,
                  lng: sensorWithFillLevel.sensor.longitude,
                }}
                color={percentToColorHex(sensorWithFillLevel.fillLevel || 0)}
              >
                <Popup>
                  <SensorMarkerPopover
                    title={sensorWithFillLevel.sensor?.name || "Unkown"}
                    content={sensorWithFillLevel.sensor?.description || ""}
                    link={`/sensors/${sensorWithFillLevel.sensor?.id}`}
                    linkLabel="See more"
                    fillLevel={sensorWithFillLevel.fillLevel}
                  />
                </Popup>
              </Marker>
            );
          })}
        </Map>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <RotateSpinner loading={true} />
          <span className="animate-pulse text-sm">Generating your map...</span>
        </div>
      )}
    </div>
  );
};

export default AllSensorsMap;
