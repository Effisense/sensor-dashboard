import useErrorToast from "@/hooks/toast/useErrorToast";
import LoadingSpinner from "../LoadingSpinner";
import Subtle from "../typography/Subtle";
import { MutableRefObject } from "react";
import { TRPCClientErrorBase } from "@trpc/client";
import { DefaultErrorShape } from "@trpc/server";

type SetSensorPositionMapProps<T extends DefaultErrorShape> = {
  container: MutableRefObject<null>;
  location?: string;
  isLoading: boolean;
  error: TRPCClientErrorBase<T> | null;
};

const SetSensorPositionMap = <T extends DefaultErrorShape>({
  container,
  location,
  isLoading,
  error,
}: SetSensorPositionMapProps<T>) => {
  useErrorToast({ error });

  return (
    <div className="relative h-full w-full bg-slate-50">
      <div
        className="relative h-[inherit] w-[inherit] rounded-lg shadow-lg"
        id="map"
      >
        <div ref={container} className="h-full w-full rounded-lg" />
      </div>
      <div className="py-8">
        {isLoading && (
          <div className="flex items-center justify-center gap-x-2">
            <LoadingSpinner />
            <span>Loading...</span>
          </div>
        )}
        {!isLoading && !error && !!location && (
          <div className="flex items-center justify-center">
            <Subtle>{location}</Subtle>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetSensorPositionMap;
