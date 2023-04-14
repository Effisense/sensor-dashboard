import { trpc } from "@/utils/trpc";
import DashContainerCard from "./DashContainerCard";
import DashSensorCard from "./DashSensorCard";
import CreateSensorMap from "./Map";
import { useState, useEffect } from "react";
import { Sensor } from "@acme/db";

interface sensorWithFillType {
  sensor: Sensor;
  fillLevel: number;
}

export default function Dashboard() {
  const {
    data: sensorsWithFillLevel,
    isLoading: sensorsIsLoading,
    error: sensorsError,
  } = trpc.sensor.getAllSensorsWithFillLevel.useQuery();
  const {
    data: containers,
    isLoading: containerIsLoading,
    error: containersError,
  } = trpc.container.getAll.useQuery();
  const [currentSensors, setCurrentSensors] = useState<sensorWithFillType[]>(
    [],
  );

  useEffect(() => {
    setCurrentSensors(sensorsWithFillLevel || []);
  }, [sensorsWithFillLevel]);

  return (
    <div className="flex w-full flex-col lg:h-[calc(100vh-8rem)] lg:flex-row">
      <div className="order-2 mx-auto overflow-y-auto p-4  lg:order-1 lg:w-1/4 lg:overflow-y-visible">
        <div className="lg:mx-auto">
          {/* {containers.map((item, index) => (
            <div key={index} className="mb-4">
              <DashContainerCard
                container={item}
                sensors={sensors}
                header={false}
                selected={false}
              />
              {index === 0 && (
                <h1 className="pt-8 text-lg font-bold">Dine søppelbøtter</h1>
              )}
            </div>
          ))} */}
        </div>
      </div>
      <div className="order-1 flex-grow lg:order-2 lg:w-2/4 ">
        {/* Replace the following line with your map component */}
        <div className="h-full w-full">
          <CreateSensorMap />
        </div>
      </div>
      <div className=" order-3 mx-auto">
        <div className="order-3 max-w-lg overflow-y-auto  p-4 lg:order-3  lg:overflow-y-visible">
          <h1 className="pb-2 text-lg font-bold">Sensorer</h1>
          {currentSensors.length === 0 && (
            <p className="text-gray-500">
              Ingen sensorer å vise. Legg til sensorer.
            </p>
          )}
          {currentSensors.map((item, index) => (
            <div key={index} className="mb-4">
              <DashSensorCard sensor={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
