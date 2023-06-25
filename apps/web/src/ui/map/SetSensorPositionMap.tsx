import useErrorToast from "@/hooks/toast/useErrorToast";
import LoadingSpinner from "../LoadingSpinner";
import Subtle from "../typography/Subtle";
import { TRPCClientErrorBase } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server";
import dynamic from "next/dynamic";
import { percentToColorHex } from "@/utils/percentToColor";
import RotateSpinner from "../RotateSpinner";
import { Sensor } from "@acme/db";
import { LatLngExpression } from "leaflet";
import { Dispatch, SetStateAction, useState } from "react";
import { Types } from "@acme/leaflet";
import { trpc } from "@/utils/trpc";

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

const SetPositionMarker = dynamic(
  () => import("@acme/leaflet").then((mod) => mod.Components.SetPositionMarker),
  {
    ssr: false,
  },
);

type SetSensorPositionMapProps<T extends DefaultErrorShape> = {
  sensor: Sensor;
  position: Types.Coordinate | null;
  setPosition: Dispatch<SetStateAction<Types.Coordinate | null>>;
  boundsFallback: Types.Coordinate;
};

const SetSensorPositionMap = <T extends DefaultErrorShape>({
  sensor,
  position,
  setPosition,
  boundsFallback,
}: SetSensorPositionMapProps<T>) => {
  const {
    data: location,
    isLoading: locationIsLoading,
    error: locationError,
    refetch,
  } = trpc.map.getLocationFromLngLat.useQuery(
    {
      latitude: position?.lat,
      longitude: position?.lng,
    },
    {
      enabled: !!position,
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
          <SetPositionMarker
            position={position}
            setPosition={setPosition}
            refetchLocation={async () => {
              await refetch();
            }}
          />
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
