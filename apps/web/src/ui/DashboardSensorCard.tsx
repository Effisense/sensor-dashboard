import { Sensor } from "@acme/db";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Card, Title, Badge } from "@tremor/react";
import Link from "next/link";
import Subtle from "./typography/Subtle";
import P from "./typography/P";
import percentToColorTremor from "@/utils/percentToSeverity";
import formatFillLevel from "@/utils/formatFillLevel";
import { cn } from "@/utils/tailwind";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";

type DashboardSensorCardProps = {
  sensor: Sensor;
  fillLevel: number | null;
  lastSeen: Date | null;
};

const DashboardSensorCard = ({
  sensor,
  fillLevel,
  lastSeen,
}: DashboardSensorCardProps) => {
  return (
    <Card className="flex w-full items-center justify-between p-4 hover:bg-slate-50">
      <div className="flex items-center justify-center gap-x-2">
        <Badge
          size="sm"
          color={percentToColorTremor(fillLevel)}
          className="mr-4 py-1 px-2"
        >
          {formatFillLevel(fillLevel)}
        </Badge>
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center justify-start gap-x-2">
            <Link href={`/sensors/${sensor.id}`}>
              <Title>{sensor.name}</Title>
            </Link>
            <Popover>
              <PopoverTrigger>
                <InformationCircleIcon className="w-4 text-blue-400" />
              </PopoverTrigger>
              <PopoverContent>
                <Subtle>Collection ID: {sensor.collectionId}</Subtle>
              </PopoverContent>
            </Popover>
          </div>
          <Subtle>{sensor.location}</Subtle>
          <Subtle>
            Last seen{" "}
            {lastSeen?.toLocaleDateString("no-NB", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Subtle>
        </div>
      </div>
      <Link href={`/sensors/${sensor.id}`}>
        <ArrowRightIcon className="w-4 transition-all duration-300 hover:translate-x-1" />
      </Link>
    </Card>
  );
};

export default DashboardSensorCard;
