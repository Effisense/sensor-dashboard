import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";

type AllSensorsMapProps = {
  sensors: Sensor[] | undefined;
};
"w-full h-96 md:h-80 lg:h-96"
const AllSensorsMap = ({ sensors }: AllSensorsMapProps) => {
  const { container, isLoading } = useAllSensorsMap({ sensors });

  return (
    <div>
      {!!container ? (
        <div className="md:h-96 md:w-96 h-96 w-96 lg:h-screen lg:w-[600px]" id="map">
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
