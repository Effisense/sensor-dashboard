import LoadingSpinner from "../LoadingSpinner";
import Subtle from "../typography/Subtle";
import dynamic from "next/dynamic";
import RotateSpinner from "../RotateSpinner";
import { Sensor } from "@acme/db";
import { Dispatch, SetStateAction } from "react";
import { Types } from "@acme/leaflet";
import { trpc } from "@/utils/trpc";
import { useDebouncedValue } from "@mantine/hooks";

const Map = dynamic(
  () => import("@acme/leaflet").then((mod) => mod.Components.Map),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

const SetPositionMarker = dynamic(
  () => import("@acme/leaflet").then((mod) => mod.Components.SetPositionMarker),
  {
    ssr: false,
  },
);

type SetSensorPositionMapProps = {
  sensor: Sensor;
  position: Types.Coordinate | null;
  setPosition: Dispatch<SetStateAction<Types.Coordinate | null>>;
  boundsFallback: Types.Coordinate;
};

const SetSensorPositionMap = ({
  sensor,
  position,
  setPosition,
  boundsFallback,
}: SetSensorPositionMapProps) => {
  const [debouncedPosition] = useDebouncedValue(position, 1000);

  const { data: location, isLoading: locationIsLoading } =
    trpc.map.getLocationFromLngLat.useQuery(
      {
        latitude: debouncedPosition?.lat,
        longitude: debouncedPosition?.lng,
      },
      {
        enabled: !!debouncedPosition,
      },
    );

  return (
    <div className="relative h-full w-full bg-slate-50">
      {sensor && position ? (
        <Map
          center={{
            lat: sensor.latitude,
            lng: sensor.longitude,
          }}
          className="relative h-[inherit] w-[inherit] rounded-lg shadow-lg"
          boundsFallback={boundsFallback}
          coordinates={[{ lat: sensor.latitude, lng: sensor.longitude }]}
        >
          <SetPositionMarker position={position} setPosition={setPosition} />
        </Map>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <RotateSpinner loading={true} />
          <span className="animate-pulse text-sm">Generating your map...</span>
        </div>
      )}
      <div className="py-4">
        {!locationIsLoading && location ? (
          <div className="flex items-center justify-center">
            <Subtle>{location}</Subtle>
          </div>
        ) : (
          <div className="flex animate-pulse items-center justify-center">
            <Subtle>Finding location...</Subtle>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetSensorPositionMap;
