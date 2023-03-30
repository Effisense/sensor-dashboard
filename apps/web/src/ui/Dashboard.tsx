import { trpc } from "@/utils/trpc";
import DashContainerCard from "./DashContainerCard";
import DashSensorCard from "./DashSensorCard";
import CreateSensorMap from "./Map";

export default function Dashboard() {
  const { sensorsWithFillLevel } = trpc.sensor.getAllSensorsWithFill.useQuery();
  const { containersWithSensorsAndFillLevels } =
    trpc.container.getAllContainersWithSensorsAndFillLevels.useQuery();

  // Replace the following example data with your actual data.
  const leftItems = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
  ];
  const rightItems = ["Item A", "Item B", "Item C", "Item D", "Item E"];

  const sensors = sensorsWithFillLevel?.map((sensor) => ({
    ...sensor,
    fillLevel: sensor.fillLevel,
  }));

  return (
    <div className="flex w-full flex-col lg:h-[calc(100vh-8rem)] lg:flex-row">
      <div className="order-2 mx-auto overflow-y-auto p-4  lg:order-1 lg:w-1/4 lg:overflow-y-visible">
        <div className="lg:mx-auto">
          {leftItems.map((item, index) => (
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
          ))}
        </div>
      </div>
      <div className="order-1 flex-grow lg:order-2 lg:w-2/4 ">
        {/* Replace the following line with your map component */}
        <div className="h-full w-full">
          <CreateSensorMap />
        </div>
      </div>
      <div className=" order-3 mx-auto">
        <div className="order-3 max-w-lg overflow-y-auto  p-4 lg:order-3 lg:w-1/5 lg:overflow-y-visible">
          <h1 className="pb-2 text-lg font-bold">Sensorer</h1>
          {rightItems.map((item, index) => (
            <div key={index} className="mb-4">
              <DashSensorCard sensor={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
