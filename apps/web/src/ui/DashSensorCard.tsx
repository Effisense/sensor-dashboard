import { Sensor } from "@acme/db";
import { Card, Title, Flex, Subtitle, Badge } from "@tremor/react";

function DashSensorCard(sensor: { sensor: Sensor; fillLevel: number }) {
  return (
    <a href="">
      <div>
        <Card>
          <Flex>
            <Badge size="lg" color="yellow" className="mr-4 h-10">
              {sensor.fillLevel} %
            </Badge>
            <div className="pr-3">
              <Title>{sensor.sensor.name}</Title>
              <Subtitle>Oppdatert: 10.38, 04.03.23</Subtitle>
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
    </a>
  );
}

export default DashSensorCard;
