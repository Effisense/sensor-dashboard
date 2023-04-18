import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getAuth } from "@clerk/nextjs/server";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { cn } from "@/utils/tailwind";
import { trpc } from "@/utils/trpc";
import { Title } from "@radix-ui/react-toast";
import { Card, Button } from "@tremor/react";
import Link from "next/link";
import { useState } from "react";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({}: IndexPageProps) => {
  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error: sensorsError,
  } = trpc.sensor.getAll.useQuery();
  const {
    data: containers,
    isLoading: containerIsLoading,
    error: containersError,
  } = trpc.container.getAll.useQuery();

  const [currentSensors, setCurrentSensors] = useState(sensors);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    null,
  );

  // const handleContainerSelect = (containerId: string | null) => {
  //   setSelectedContainerId(containerId);

  //   if (!containerId) {
  //     setCurrentSensors(sensors || []);
  //     return;
  //   }

  //   const sensors = sensors?.filter(
  //     (item) => item.sensor.containerId === containerId,
  //   );
  //   setCurrentSensors(sensors);
  // };

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
              <Card
                className={cn(
                  "mt-4 transition-all duration-300",
                  !selectedContainerId ? "bg-green-5" : "bg-slate-100",
                )}
                // onClick={() => handleContainerSelect(null)}
              >
                <Title>Alle containers</Title>
              </Card>

              <h1 className="pt-8 pb-3 text-lg font-bold">Dine søppelbøtter</h1>
              {containers?.map((container) => (
                <Link href={`/containers/${container.id}`} key={container.id}>
                  <Card
                    key={container.id}
                    className={cn(
                      "mt-4 transition-all duration-300",
                      !(container.id === selectedContainerId)
                        ? "bg-green-5"
                        : "bg-slate-100",
                    )}
                    // onClick={() => handleContainerSelect(container.id)}
                  >
                    <Title>{container.name}</Title>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="order-1 flex-grow lg:order-2 lg:w-2/4 ">
        <div className="h-full w-full">
          {sensors ? <AllSensorsMap sensors={sensors} /> : <LoadingSpinner />}
        </div>
      </div>
      <div className="order-3 mx-auto">
        <div className="order-3 max-w-lg overflow-y-auto  p-4 lg:order-3  lg:overflow-y-visible">
          <h1 className="pb-2 text-lg font-bold">Sensors</h1>
          {currentSensors && currentSensors.length === 0 && (
            <Link href="/sensors/create">
              <Button>Add sensor</Button>
            </Link>
          )}
          {/* {currentSensors &&
            currentSensors.map((item, index) => (
              <div key={index} className="mb-4">
                <DashboardSensorCard
                  sensor={item.sensor}
                  fillLevel={item.fillLevel}
                />
              </div>
            ))} */}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  return {
    props: { userId },
  };
};

export default IndexPage;
