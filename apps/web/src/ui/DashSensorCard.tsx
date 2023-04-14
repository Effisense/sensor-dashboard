import { Sensor } from "@acme/db";
import { Card, Title, Flex, Subtitle, Badge } from "@tremor/react";
import Link from "next/link";

type DashSensorCardProps = {
  sensor: Sensor;
  fillLevel: number;
};

function DashSensorCard({ sensor, fillLevel }: DashSensorCardProps) {
  return (
    <Link href={`/sensors/${sensor.id}`}>
      <div>
        <Card>
          <Flex>
            <Badge size="lg" color="yellow" className="mr-4 h-10">
              {fillLevel} %
            </Badge>
            <div className="pr-3">
              <Title>{sensor.name}</Title>
            </div>
            <div className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </div>
          </Flex>
        </Card>
      </div>
    </Link>
  );
}

export default DashSensorCard;
