import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";

type AllSensorsMapProps = {
  sensors: Sensor[];
};

const AllSensorsMap = ({ sensors }: AllSensorsMapProps) => {
  const { container, isLoading } = useAllSensorsMap({ sensors });

  return (
    <div>
      {!!container ? (
        <div className="h-72 w-72" id="map">
          <div ref={container} className="h-full w-full" />
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
