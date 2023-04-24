import { Button } from "@/ui/Button";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { PencilIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Alert from "@/ui/Alert";
import useGetSensor from "@/hooks/queries/useGetSensor";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { Badge, Card, Text, Title } from "@tremor/react";
import SeverityToIcon from "@/ui/utils/SeverityToIcon";
import { cn } from "@/utils/tailwind";
import H3 from "@/ui/typography/H3";
import Subtle from "@/ui/typography/Subtle";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";
import { useEffect, useMemo, useState } from "react";
import { AreaChart } from "@tremor/react";
import { trpc } from "@/utils/trpc";
import percentToColorTremor from "@/utils/percentToColor";

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const endDate = new Date();

  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate,
    endDate,
  });
  endDate.setDate(endDate.getDate() - 7);

  const {
    data: fillLevelBetweenDates,
    isLoading: fillLevelIsLoading,
    error: fillLevelError,
  } = trpc.sensor.getWithFillLevelBetweenDates.useQuery({
    sensorId: id,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const { data, isLoading, deleteSensorMutation } = useGetSensor({ id });
  const {
    data: sensorWithFill,
    isLoading: sensorWithFillIsLoading,
    error: sensorWithFillError,
  } = trpc.sensor.getFillLevel.useQuery({ sensorId: id });

  const [value, setValue] = useState<DateRangePickerValue>([
    startDate,
    endDate,
  ]);

  const dataFormatter = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
  };

  const onDelete = async () => {
    await deleteSensorMutation({ sensorId: id });
  };

  useEffect(() => {
    if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
      setDateRange({
        startDate: value[0],
        endDate: value[1],
      });
    }
  }, [value]);

  const chartData = useMemo(() => {
    if (!fillLevelBetweenDates) return [];

    return fillLevelBetweenDates.map((entry) => ({
      date: entry.dateAndTime,
      SemiAnalysis: entry.fillLevel || 0,
    }));
  }, [fillLevelBetweenDates]);

  return (
    <div className="grid min-h-[calc(100vh-6rem)] w-11/12 grid-cols-1 gap-y-4 md:w-full md:gap-x-2 md:px-4 lg:grid-cols-3 lg:gap-y-0">
      {isLoading ? (
        <div className="col-span-3 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        data && (
          <>
            <div
              className={cn(
                "col-span-1 grid w-full rounded-lg lg:col-span-2",
                "bg-slate-50 shadow-md transition-all duration-300 md:m-0",
                "flex flex-col items-center justify-start p-4",
              )}
            >
              {sensorWithFill ? (
                <AllSensorsMap sensorWithFill={sensorWithFill} />
              ) : (
                <div>
                  {/* TODO: This could be prettier */}
                  <p>Could not load map</p>
                </div>
              )}
            </div>

            <div className="col-span-1 h-96 lg:col-span-1 lg:h-auto">
              <div className="mb-4 mt-4 flex flex-col items-center justify-start">
                <div className="flex flex-row gap-x-2">
                  <H3>{data.sensor.name}</H3>
                  {SeverityToIcon("success")}
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
                        sensorWithFill && sensorWithFill[0]
                          ? percentToColorTremor(sensorWithFill[0].fillLevel)
                          : "gray"
                      }
                      className="mr-4 py-1 px-2"
                    >
                      {sensorWithFill?.[0]?.fillLevel === null
                        ? "N/A"
                        : `${sensorWithFill?.[0]?.fillLevel} %`}
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
                  value={value}
                  onValueChange={setValue}
                  dropdownPlaceholder="Select dates"
                />

                {chartData.length === 0 ? (
                  <div className="flex h-72 items-center justify-center">
                    <p className="px-12 text-center text-sm text-gray-500">
                      No data available. Choose another time interval or wait
                      for sensor to collect data
                    </p>
                  </div>
                ) : (
                  <AreaChart
                    className="mt-4 h-72"
                    data={chartData}
                    index="date"
                    categories={["Fill Level"]}
                    colors={["cyan"]}
                    valueFormatter={dataFormatter}
                  />
                )}
              </div>
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
