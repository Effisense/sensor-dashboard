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
    <Link href={`/sensors/${sensor.id}`}>
      <div>
        <Card>
          <div className="flex items-center justify-center gap-x-2">
            <Badge size="lg" color="yellow" className="mr-4 h-10">
              {fillLevel === null ? "N/A" : `${fillLevel} %`}
            </Badge>
            <div className="pr-3">
              <Title>{sensor.name}</Title>
            </div>
            <ArrowRightIcon className="w-4" />
          </div>
        </Card>
      </div>
    </Link>
  );
};

export default DashboardSensorCard;
