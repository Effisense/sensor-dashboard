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

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const { data, isLoading, deleteSensorMutation } = useGetSensor({ id });

  const onDelete = async () => {
    await deleteSensorMutation({ sensorId: id });
  };

  return (
    <div className="grid-row-1 grid min-h-[calc(100vh-6rem)] w-11/12 gap-y-4 md:w-full md:gap-x-2 md:px-4 lg:grid-cols-4 lg:gap-y-0">
      {isLoading && (
        <div className="col-span-4 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && data && (
        <>
          <div
            className={cn(
              " grid-col grid w-full rounded-lg lg:col-start-1",
              "bg-slate-50 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
              "flex flex-col items-center justify-start p-4",
            )}
          >
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
            <div>
              <Card
                className="mx-auto flex max-w-sm flex-col gap-y-4"
                decoration="top"
                decorationColor="teal"
              >
                <div className="flex h-8 items-center">
                  <Badge size="sm" color="yellow">
                    54%
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
            </div>
          </div>

          <div className="row-start-1 h-96 lg:col-span-2 lg:col-start-2 lg:h-auto">
            <AllSensorsMap sensors={[data.sensor]} />
          </div>
          <div
            className={cn(
              " grid-col grid w-full rounded-lg lg:col-start-4",
              "bg-slate-50 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
              "flex flex-col items-center justify-start p-4",
            )}
          >
            TODO: graphs here
          </div>
        </>
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
