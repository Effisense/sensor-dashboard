import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Card, Title, Badge } from "@tremor/react";
import Link from "next/link";
import Subtle from "./typography/Subtle";
import P from "./typography/P";
import percentToColorTremor from "@/utils/percentToColor";
import { SensorSchema } from "@acme/db/src/schema";

type DashboardSensorCardProps = {
  sensor: SensorSchema;
  fillLevel: number | null;
};

const DashboardSensorCard = ({
  sensor,
  fillLevel,
}: DashboardSensorCardProps) => {
  return (
    <Link href={`/sensors/${sensor.id}`}>
      <Card className="flex w-full items-center justify-between p-4 hover:bg-slate-50">
        <div className="flex items-center justify-center gap-x-2">
          <Badge
            size="sm"
            color={percentToColorTremor(fillLevel)}
            className="mr-4 py-1 px-2"
          >
            {fillLevel === null ? "N/A" : `${fillLevel} %`}
          </Badge>
          <div className="flex flex-col items-start justify-center">
            <Title>{sensor.name}</Title>
            <Subtle>{sensor.location}</Subtle>
          </div>
        </div>
        <ArrowRightIcon className="w-4 transition-all duration-300 hover:translate-x-1" />
      </Card>
    </Link>
  );
};

export default DashboardSensorCard;
