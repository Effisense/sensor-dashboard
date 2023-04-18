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
import { Card } from "@tremor/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import DashboardSensorCard from "@/ui/DashboardSensorCard";
import P from "@/ui/typography/P";
import H4 from "@/ui/typography/H4";
import Subtle from "@/ui/typography/Subtle";
import H3 from "@/ui/typography/H3";
import { Button } from "@/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({}: IndexPageProps) => {
  const { orgId } = useAuth();
  const {
    data: sensors,
    isLoading: sensorsIsLoading,
    error: sensorsError,
    refetch: refetchSensors,
  } = trpc.sensor.getAll.useQuery();

  const {
    data: containers,
    isLoading: containerIsLoading,
    error: containersError,
    refetch: refetchContainers,
  } = trpc.container.getAll.useQuery();

  const [currentSensors, setCurrentSensors] = useState(sensors);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setCurrentSensors(sensors);
  }, [sensors]);

  useEffect(() => {
    if (!orgId) return;
    const refetch = async () => {
      await refetchSensors();
      await refetchContainers();
    };

    refetch();
  }, [orgId, refetchContainers, refetchSensors]);

  const handleContainerSelect = (containerId: string | null) => {
    setSelectedContainerId(containerId);

    if (!containerId) {
      setCurrentSensors(sensors || []);
      return;
    }

    const current = sensors?.filter((item) => item.containerId === containerId);
    setCurrentSensors(current);
  };

  return (
    <div className="flex w-11/12 flex-col lg:flex-row">
      <div className="order-2 m-2 w-full overflow-y-auto rounded-lg bg-slate-50 p-4 shadow-md hover:shadow-lg lg:order-1 lg:w-1/4 lg:overflow-y-visible">
        <div className="lg:mx-auto">
          {containers?.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <P>No containers found.</P>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <H3>Your containers</H3>
                <Subtle>Filter by selecting a container.</Subtle>
              </div>
              <Card
                className={cn(
                  "mb-4 transition-all duration-300",
                  !selectedContainerId ? "bg-green-5" : "bg-white",
                )}
                onClick={() => handleContainerSelect(null)}
              >
                <Title>All containers</Title>
              </Card>

              <hr className="mb-4 h-[2px] rounded-full bg-slate-200" />

              {containers?.map((container) => (
                <Card
                  key={container.id}
                  className={cn(
                    "flex items-center justify-between",
                    "mb-4 bg-white transition-all duration-300",
                    selectedContainerId === container.id ? "bg-green-5" : "",
                  )}
                  onClick={() => handleContainerSelect(container.id)}
                >
                  <Title>{container.name}</Title>
                  <Link href={`/containers/${container.id}`} key={container.id}>
                    <ArrowRightIcon className="w-4 transition-all duration-300 hover:translate-x-1" />
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="order-1 flex-grow lg:order-2 lg:w-2/4">
        <div className="h-full w-full">
          {sensors ? <AllSensorsMap sensors={sensors} /> : <LoadingSpinner />}
        </div>
      </div>

      <div className="order-3 m-2 w-full max-w-lg overflow-y-auto rounded-lg bg-slate-50 p-4 shadow-md hover:shadow-lg lg:order-3 lg:overflow-y-visible">
        <div className="mb-4">
          <H3>Your sensors</H3>
          <Subtle>Click a sensor to view more.</Subtle>
        </div>
        {currentSensors && currentSensors.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Subtle>No sensors found.</Subtle>
            <Link href="/sensors/create">
              <Button variant="link">Add sensor</Button>
            </Link>
          </div>
        )}
        {currentSensors &&
          currentSensors.map((sensor, index) => (
            <div key={index} className="mb-4">
              <DashboardSensorCard sensor={sensor} fillLevel={50} />
            </div>
          ))}
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
