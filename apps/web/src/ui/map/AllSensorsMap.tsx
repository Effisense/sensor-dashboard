import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";

type AllSensorsMapProps = {
  sensors: Sensor[] | undefined;
};

const AllSensorsMap = ({ sensors }: AllSensorsMapProps) => {
  const { container, isLoading } = useAllSensorsMap({ sensors });

  return (
    <div>
      {!!container ? (
        <div className="h-96 w-96 rounded-lg shadow-lg" id="map">
          <div ref={container} className="h-full w-full rounded-lg" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};

export default AllSensorsMap;
