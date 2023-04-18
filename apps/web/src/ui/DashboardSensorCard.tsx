import { Sensor } from "@acme/db";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Card, Title, Badge } from "@tremor/react";
import Link from "next/link";

type DashboardSensorCardProps = {
  sensor: Sensor;
  fillLevel: number | null;
};

const DashboardSensorCard = ({
  sensor,
  fillLevel,
}: DashboardSensorCardProps) => {
  return (
    <div>
      <Card>
        <div className="flex items-center justify-center gap-x-2">
          <Badge size="sm" color="yellow" className="mr-4 h-10">
            {fillLevel === null ? "N/A" : `${fillLevel} %`}
          </Badge>
          <div className="pr-3">
            <Title>{sensor.name}</Title>
          </div>
          <Link href={`/sensors/${sensor.id}`}>
            <ArrowRightIcon className="w-4 transition-all duration-300 hover:translate-x-1" />
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardSensorCard;
