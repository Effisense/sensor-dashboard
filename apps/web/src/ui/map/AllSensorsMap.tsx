import useAllSensorsMap from "@/hooks/map/useAllSensorsMap";
import LoadingSpinner from "../LoadingSpinner";
import { Sensor } from "@acme/db";

type AllSensorsMapProps = {
  sensor: Sensor | undefined;
  fillLevel: number | null;
}[];

type AllSensorsMapComponentProps = {
  sensorWithFill: AllSensorsMapProps;
};

const AllSensorsMap = ({ sensorWithFill }: AllSensorsMapComponentProps) => {
  const { container, isLoading } = useAllSensorsMap({
    sensorsWithFillLevel: sensorWithFill,
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
