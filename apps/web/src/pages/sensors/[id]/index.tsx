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
    <div className="grid min-h-[calc(100vh-6rem)] w-11/12 grid-row-1 gap-y-4 md:w-full md:gap-x-2 md:px-4 lg:grid-cols-4 lg:gap-y-0">
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <><div className={cn(
          " w-full rounded-lg lg:col-start-1 grid grid-col",
          "bg-slate-50 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
          "flex justify-start items-center flex-col p-4"
        )}>
        <div className="mb-4 flex justify-start items-center flex-col mt-4">
        <div className="flex flex-row gap-x-2">
          <H3>{data.sensor.name}</H3>
          {SeverityToIcon("success")}
        </div>
          <Subtle>Information about your sensor</Subtle>
        </div>
          <div>
            <Card
              className="mx-auto flex max-w-sm flex-col gap-y-4"
              decoration="top"
              decorationColor="teal"
            >
          <div className="h-8 flex items-center">
            <Badge size="sm" color="yellow">
              54%
            </Badge>
          </div>
              <div className="mt-2 flex flex-row gap-x-2">
                <TrashIcon className="w-4" />
                <Text>
                  {" "}
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
                  )}{" "}
                </Text>
              </div>
              <div className="flex flex-row gap-x-2">
                <MapPinIcon className="w-4" />
                <Text>{data?.sensor.location}</Text>
              </div>
              <Card className="mx-auto mt-8 max-w-xs">
                <Text>{data?.sensor.description}</Text>
              </Card>
              <div className="items-left justify-left my-4 mt-8 flex flex-row gap-x-4">
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
                  trigger={<Button
                    variant="subtle"
                    className="flex items-center justify-center gap-x-2"
                  >
                    <TrashIcon className="w-4" />
                    <span>Delete</span>
                  </Button>}
                  onDelete={onDelete} />
              </div>
            </Card>
          </div>
        </div>
       
        <div className="row-start-1 h-96 lg:col-span-2 lg:col-start-2 lg:h-auto">
              <AllSensorsMap sensors={[data.sensor]} />
        </div>
        <div className={cn(
          " w-full rounded-lg lg:col-start-4 grid grid-col",
          "bg-slate-50 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
          "flex justify-start items-center flex-col p-4"
        )}>
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
