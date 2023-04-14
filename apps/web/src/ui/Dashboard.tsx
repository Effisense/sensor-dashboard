import { trpc } from "@/utils/trpc";
import DashContainerCard from "./DashContainerCard";
import DashSensorCard from "./DashSensorCard";
import { useState, useEffect } from "react";
import { Sensor } from "@acme/db";
import { Card, Title } from "@tremor/react";
import { MouseEvent } from "react";
import AllSensorsMap from "./map/AllSensorsMap";

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
  const [selectedContainer, setSelectedContainer] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setCurrentSensors(sensorsWithFillLevel || []);
  }, [sensorsWithFillLevel]);

  const handleContainerSelect = (containerId: string | null) => {
    setSelectedContainer(containerId);
    if (containerId === null) {
      setCurrentSensors(sensorsWithFillLevel || []);
      return;
    }
    const selectedSensors = sensorsWithFillLevel?.filter(
      (sensorWithFill) => sensorWithFill.sensor.containerId === containerId,
    );
    setCurrentSensors(selectedSensors || []);
  };

  return (
    <div className="flex w-full flex-col lg:h-[calc(100vh-8rem)] lg:flex-row">
      <div className="order-2 mx-auto overflow-y-auto p-4  lg:order-1 lg:w-1/4 lg:overflow-y-visible">
        <div className="lg:mx-auto">
          {containers?.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <p className="text-sm text-gray-500">
                Du har ingen søppelbøtter registrert
              </p>
            </div>
          ) : (
            <div>
              <h1 className="pt-8 pb-3 text-lg font-bold">Alle søppelbøtter</h1>
              <p className="-mt-2 text-sm text-gray-500">
                Du kan filtrere sensorene ved å trykke på en container
              </p>
              <a href="#" onClick={() => handleContainerSelect(null)}>
                <Card
                  className={`${
                    selectedContainer == null
                      ? "bg-lime-900"
                      : "hover:bg-green-5"
                  } mt-4 bg-green-3 transition-colors hover:bg-green-5`}
                >
                  <Title>Alle containers</Title>
                </Card>
              </a>

              <h1 className="pt-8 pb-3 text-lg font-bold">Dine søppelbøtter</h1>
              {containers?.map((container, index) => (
                <div key={index} className="mb-4">
                  <DashContainerCard
                    container={container}
                    isSelected={container.id === selectedContainer}
                    onSelect={() => handleContainerSelect(container.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="order-1 flex-grow lg:order-2 lg:w-2/4 ">
        <div className="h-full w-full">
          <AllSensorsMap sensors={currentSensors.map((s) => s.sensor)} />
        </div>
      </div>
      <div className=" order-3 mx-auto">
        <div className="order-3 max-w-lg overflow-y-auto  p-4 lg:order-3  lg:overflow-y-visible">
          <h1 className="pb-2 text-lg font-bold">Sensorer</h1>
          {currentSensors.length === 0 && (
            <p className="text-gray-500">
              Ingen sensorer å vise. Legg til sensorer ved å trykke <br />
              "Add sensor" i menyen.
            </p>
          )}
          {currentSensors.map((item, index) => (
            
            <div key={index} className="mb-4">
              <DashSensorCard sensor={item.sensor} fillLevel={item.fillLevel} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
