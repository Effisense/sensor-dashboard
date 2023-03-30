import { trpc } from "@/utils/trpc";
import DashContainerCard from "./DashContainerCard";
import DashSensorCard from "./DashSensorCard";
import CreateSensorMap from "./Map";

export default function Dashboard() {
  const { sensorsWithFillLevel } = trpc.sensor.getAllSensorsWithFill.useQuery();
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

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col md:flex-row">
      <div className="overflow-y-aut order-2 p-4 md:order-1 md:w-1/4 lg:w-1/6">
        {leftItems.map((item, index) => (
          <div key={index} className="mb-4">
            <DashContainerCard container={item} />
          </div>
        ))}
      </div>
      <div className="order-1 flex-grow md:order-2 md:w-2/4 lg:w-2/3">
        {/* Replace the following line with your map component */}
        <div className="h-full w-full">
          <CreateSensorMap />
        </div>
      </div>
      <div className="order-3 overflow-y-auto p-4 md:order-3 md:w-1/4 lg:w-1/6">
        {rightItems.map((item, index) => (
          <div key={index} className="mb-4">
            <DashSensorCard sensor={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
