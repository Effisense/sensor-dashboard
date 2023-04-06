import useErrorToast from "@/hooks/toast/useErrorToast";
import useAllSensorsMap from "@/hooks/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import Subtle from "../typography/Subtle";

const AllSensorsMap = () => {
  const { container, isLoading, error } = useAllSensorsMap();

  useErrorToast({ error });

  return (
    <div>
      {!!container && (
        <div className="h-72 w-72" id="map">
          <div ref={container} className="h-full w-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      )}
      <div className="py-8">
        {!isLoading && !error && (
          <div className="flex items-center justify-center">
            <Subtle>All sensors loaded successfully.</Subtle>
          </div>
        )}
        {!isLoading && error && (
          <div className="flex items-center justify-center">
            <Subtle>An error occurred while loading sensors.</Subtle>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSensorsMap;
