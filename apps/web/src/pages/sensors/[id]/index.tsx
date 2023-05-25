import { Button } from "@/ui/Button";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { PencilIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Alert from "@/ui/Alert";
import useGetSensor from "@/hooks/queries/useGetSensor";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { Badge, Card, Text, Title } from "@tremor/react";
import { cn } from "@/utils/tailwind";
import H3 from "@/ui/typography/H3";
import Subtle from "@/ui/typography/Subtle";
import { DateRangePicker } from "@tremor/react";
import { useEffect, useMemo } from "react";
import { AreaChart } from "@tremor/react";
import { trpc } from "@/utils/trpc";
import percentToColorTremor from "@/utils/percentToColor";
import useDateRange from "@/hooks/useDateRange";
import { FILL_LEVEL_LEGEND, formatAreaChart } from "@/utils/tremor";

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const { startDate, endDate, setDateRange } = useDateRange({});

  const {
    data: fillLevelBetweenDates,
    isLoading: fillLevelBetweenDatesIsLoading,
    error: fillLevelBetweenDatesError,
    refetch: refetchFillLevelBetweenDates,
  } = trpc.sensor.getWithFillLevelBetweenDates.useQuery({
    sensorId: id,
    startDate: startDate || new Date(),
    endDate: endDate || new Date(),
  });

  console.log(fillLevelBetweenDates);

  useEffect(() => {
    if (!startDate || !endDate) return;
    const refetch = async () => {
      await refetchFillLevelBetweenDates();
    };
    refetch();
  }, [startDate, endDate, refetchFillLevelBetweenDates]);

  const { data, isLoading, deleteSensorMutation } = useGetSensor({ id });
  const {
    data: sensorWithFillLevel,
    isLoading: sensorWithFillLevelIsLoading,
    error: sensorWithFillLevelError,
  } = trpc.sensor.getWithFillLevel.useQuery({ sensorId: id });

  const onDelete = async () => {
    await deleteSensorMutation({ sensorId: id });
  };

  const chartData = useMemo(() => {
    if (!fillLevelBetweenDates) return [];

    return fillLevelBetweenDates.map((entry) => ({
      date: entry.datetime.toUTCString(),
      [`${FILL_LEVEL_LEGEND}`]: entry.fillLevel || 0,
    }));
  }, [fillLevelBetweenDates]);

  return (
    <div className="grid min-h-[calc(100vh-6rem)] w-11/12 grid-cols-1 md:w-full md:gap-x-2 md:px-4 lg:grid-cols-3 lg:grid-rows-1">
      {isLoading ? (
        <div className="col-span-3 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        data && (
          <>
            <div className="col-span-1 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:h-auto">
              <div className="mb-4 mt-0 flex flex-col items-center justify-start lg:mt-4">
                <div className="mt-6 flex flex-row gap-x-2 lg:mt-0">
                  <H3>{data.sensor.name}</H3>
                </div>
                <Subtle>Information about your sensor</Subtle>
              </div>
              <div className="my-4 flex items-center justify-center gap-x-4">
                <Link href={`/sensors/${id}/update`}>
                  <Button
                    variant="subtle"
                    className="flex items-center justify-center gap-x-2"
                  >
                    <PencilIcon className="w-4" />
                    <span>Update</span>
                  </Button>
                </Link>
                <Alert
                  title="Are you sure you want to delete the sensor?"
                  description="The sensor will be permanently deleted."
                  trigger={
                    <Button
                      variant="subtle"
                      className={cn(
                        "flex items-center justify-center gap-x-2 bg-red-500 text-slate-100",
                        "hover:bg-red-600 hover:text-slate-50",
                      )}
                    >
                      <TrashIcon className="w-4" />
                      <span>Delete</span>
                    </Button>
                  }
                  onDelete={onDelete}
                />
              </div>
              <div className="mx-auto max-w-md">
                <Card
                  className="mx-auto flex max-w-md flex-col gap-y-4"
                  decoration="top"
                  decorationColor="teal"
                >
                  <div className="flex h-8 items-center">
                    <Badge
                      size="sm"
                      color={
                        sensorWithFillLevel && sensorWithFillLevel
                          ? percentToColorTremor(sensorWithFillLevel.fillLevel)
                          : "gray"
                      }
                      className="mr-4 py-1 px-2"
                    >
                      {!sensorWithFillLevel?.fillLevel
                        ? "N/A"
                        : `${sensorWithFillLevel?.fillLevel} %`}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-row gap-x-2">
                    <TrashIcon className="w-4" />
                    <Text>
                      {data?.container ? (
                        <>
                          <Link
                            className="hover:underline"
                            href={`/containers/${data.sensor.containerId}`}
                          >
                            {data.container.name}
                          </Link>
                        </>
                      ) : (
                        <span>No container</span>
                      )}
                    </Text>
                  </div>
                  <div className="flex flex-row gap-x-2">
                    <MapPinIcon className="w-4" />
                    <Text>{data?.sensor.location}</Text>
                  </div>
                  <Card className="mt-1 w-full p-4">
                    <Text>{data?.sensor.description}</Text>
                  </Card>
                </Card>
                <Title className="pt-5">History</Title>
                <DateRangePicker
                  className="mx-auto max-w-md pt-4"
                  value={[startDate, endDate]}
                  onValueChange={setDateRange}
                  dropdownPlaceholder="Select dates"
                />
                {fillLevelBetweenDatesIsLoading ? (
                  <div className="flex h-72 items-center justify-center">
                    <LoadingSpinner />
                  </div>
                ) : (
                  chartData.length === 0 && (
                    <div className="flex h-72 items-center justify-center">
                      <p className="px-12 text-center text-sm text-gray-500">
                        No data available. Choose another time interval or wait
                        for sensor to collect data.
                      </p>
                    </div>
                  )
                )}

                {chartData.length > 0 && (
                  <AreaChart
                    className="mt-4 h-72"
                    data={chartData}
                    index="date"
                    categories={[FILL_LEVEL_LEGEND]}
                    colors={["emerald"]}
                    valueFormatter={formatAreaChart}
                  />
                )}
              </div>
            </div>
            <div
              className={cn(
                "col-span-1 grid w-full rounded-lg lg:col-span-2 lg:col-start-1",
                "bg-slate-50 p-0 shadow-md transition-all duration-300",
                "flex flex-col items-center justify-start",
                "h-[calc(100vh-12rem)] lg:mt-2 lg:h-auto",
                "lg:row-start-1",
              )}
            >
              {sensorWithFillLevel ? (
                <AllSensorsMap sensorsWithFillLevel={[sensorWithFillLevel]} />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ id: string }>,
) => {
  const id = context.params?.id;

  if (!id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id,
    },
  };
};

export default SensorPage;
