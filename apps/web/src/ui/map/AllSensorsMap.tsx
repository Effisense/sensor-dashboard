import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { SensorSchema } from "@acme/db/src/schema";

type AllSensorsMapProps = {
  sensor: SensorSchema | undefined;
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
  const { container, isLoading } = useAllSensorsMap({
    sensorsWithFillLevel,
    searchBar,
  });

  return (
    <div className="relative h-full w-full bg-slate-50">
      {!!container ? (
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
      )}
    </div>
  );
};

export default AllSensorsMap;
