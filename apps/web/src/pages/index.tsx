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
import Subtle from "@/ui/typography/Subtle";
import H3 from "@/ui/typography/H3";
import { Button } from "@/ui/Button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { SelectContainerQuery, SelectContainerQuerySchema } from "@/schemas";

type IndexPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const IndexPage = ({ containerId }: IndexPageProps) => {
  const router = useRouter();
  const { orgId } = useAuth();
  const {
    data: sensorsWithFillLevel,
    isLoading: sensorsWithFillLevelIsLoading,
    error: sensorsWithFillLevelError,
    refetch: refetchSensors,
  } = trpc.sensor.getAllSensorsWithFillLevel.useQuery();

  const {
    data: containers,
    isLoading: containerIsLoading,
    error: containersError,
    refetch: refetchContainers,
  } = trpc.container.getAll.useQuery();

  const [currentSensorsWithFillLevel, setCurrentSensorsWithFillLevel] =
    useState(sensorsWithFillLevel);
  const [selectedContainerId, setSelectedContainerId] = useState<number | null>(
    containerId || null,
  );

  useEffect(() => {
    setCurrentSensorsWithFillLevel(sensorsWithFillLevel);
  }, [sensorsWithFillLevel]);

  useEffect(() => {
    if (!orgId) return;
    const refetch = async () => {
      await refetchSensors();
      await refetchContainers();
    };

    refetch();
  }, [orgId, refetchContainers, refetchSensors]);

  const handleContainerSelect = async (containerId: number | null) => {
    setSelectedContainerId(containerId);

    // Don't update URL state if the container is already selected
    if (selectedContainerId === containerId) return;

    // Update URL state
    await router.push(!containerId ? "/" : `?containerId=${containerId}`);
    router.reload();
  };

  useEffect(() => {
    if (!containerId) {
      setCurrentSensorsWithFillLevel(sensorsWithFillLevel || []);
      return;
    }

    const current = sensorsWithFillLevel?.filter(
      (item) => item.sensor.containerId === containerId,
    );
    setCurrentSensorsWithFillLevel(current);
  }, [containerId, sensorsWithFillLevel]);

  return (
    <div className="grid min-h-[calc(100vh-6rem)] w-11/12 grid-cols-1 gap-y-4 md:w-full md:gap-x-2 md:px-4 lg:grid-cols-4 lg:gap-y-0">
      <div
        className={cn(
          "my-4 w-full rounded-lg bg-slate-50 lg:col-start-1",
          "p-4 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
        )}
      >
        <div className="lg:mx-auto">
          <div className="mb-4">
            <H3>Your containers</H3>
            <Subtle>Click a container to filter out its sensors.</Subtle>
          </div>
          {containers && containers.length === 0 ? (
            <div>
              <div className="flex flex-col items-center justify-center">
                <Subtle>No containers found.</Subtle>
                <Link href="/containers/create">
                  <Button variant="outline" className="mt-4">
                    Add container
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <Card
                className={cn(
                  "mb-4 transition-all duration-300",
                  !selectedContainerId
                    ? "bg-green-5 hover:bg-green-6"
                    : "bg-white hover:bg-slate-50",
                )}
                onClick={() => handleContainerSelect(null)}
              >
                <Title>All containers</Title>
              </Card>

              <hr className="mb-4 h-[2px] rounded-full bg-slate-200" />

              {containerIsLoading ? (
                <div className="flex animate-pulse flex-wrap justify-center">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Card
                      key={index}
                      className={cn(
                        "mb-4 h-20 bg-slate-200 transition-all duration-700",
                        "flex animate-pulse items-center justify-between",
                      )}
                    ></Card>
                  ))}
                </div>
              ) : containersError ? (
                <div className="flex flex-col items-center justify-center">
                  <Subtle>Could not load containers.</Subtle>
                  <Button
                    variant="outline"
                    onClick={() => refetchContainers()}
                    className="mt-4"
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div>
                  {containers?.map((container) => (
                    <Card
                      key={container.id}
                      className={cn(
                        "flex items-center justify-between ",
                        "mb-4 bg-white transition-all duration-300",
                        selectedContainerId === container.id
                          ? "bg-green-5 hover:bg-green-6"
                          : "hover:bg-slate-50",
                      )}
                      onClick={() => handleContainerSelect(container.id)}
                    >
                      <Title>{container.name}</Title>
                      <Link
                        href={`/containers/${container.id}`}
                        key={container.id}
                      >
                        <ArrowRightIcon className="w-4 transition-all duration-300 hover:translate-x-1" />
                      </Link>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="row-start-1 h-96 lg:col-span-2 lg:col-start-2 lg:h-auto">
        <div className="h-full w-full">
          {currentSensorsWithFillLevel ? (
            <AllSensorsMap sensorsWithFillLevel={currentSensorsWithFillLevel} />
          ) : (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
        </div>
      </div>

      <div
        className={cn(
          "my-2 w-full rounded-lg lg:col-start-4",
          "bg-slate-50 p-4 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
        )}
      >
        <div className="mb-4">
          <H3>Your sensors</H3>
          <Subtle>Click a sensor to view more.</Subtle>
        </div>

        {sensorsWithFillLevelIsLoading ? (
          <div className="flex animate-pulse flex-wrap justify-center">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={index}
                className={cn(
                  "mb-4 h-20 bg-slate-200 transition-all duration-700",
                  "flex animate-pulse items-center justify-between",
                )}
              ></Card>
            ))}
          </div>
        ) : sensorsWithFillLevelError ? (
          <div className="flex flex-col items-center justify-center">
            <Subtle>Could not load sensors.</Subtle>
            <Button
              variant="outline"
              onClick={() => refetchSensors()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="my-4">
            {currentSensorsWithFillLevel &&
              currentSensorsWithFillLevel.length === 0 && (
                <div className="flex flex-col items-center justify-center">
                  <Subtle>No sensors found.</Subtle>
                  <Link href="/sensors/create">
                    <Button variant="outline" className="mt-4">
                      Add sensor
                    </Button>
                  </Link>
                </div>
              )}
            {currentSensorsWithFillLevel &&
              currentSensorsWithFillLevel.map((sensor, index) => (
                <div key={index} className="mb-4">
                  <DashboardSensorCard
                    sensor={sensor.sensor}
                    fillLevel={sensor.fillLevel}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  const { success: hasContainerId } = SelectContainerQuerySchema.safeParse(
    ctx.query,
  );

  if (!hasContainerId) {
    return {
      props: { userId },
    };
  }

  const { containerId } = ctx.query as SelectContainerQuery;
  const parsedContainerId = parseInt(containerId);

  return {
    props: { userId, containerId: parsedContainerId },
  };
};

export default IndexPage;
