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
    <div>
      <div className="h-72 w-72" id="map">
        <div ref={container} className="w-full" />
      </div>
      <div className="py-8">
        {isLoading && (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
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