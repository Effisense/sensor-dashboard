import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Textarea } from "@/ui/Textarea";
import H4 from "@/ui/typography/H4";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Alert from "@/ui/Alert";
import useGetSensor from "@/hooks/queries/useGetSensor";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { Sensor } from "@acme/db";
import { Card, Metric, Text, Title } from "@tremor/react";

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const { data, isLoading, deleteSensorMutation } = useGetSensor({ id });

  const sensors : Sensor[] = [];
  if (data && data.sensor) {
    sensors.push(data.sensor);
  }

  const onDelete = async () => {
    await deleteSensorMutation({ sensorId: id });
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <><div className="flex flex-row items-center justify-center gap-x-2">
            <div className="h-full w-full mt-8">
            <AllSensorsMap sensors={sensors} />
            </div>
          <div>
            <Card className="max-w-sm mx-auto flex flex-col gap-y-4" decoration="top" decorationColor="teal">
              <Title>{data?.sensor.name}</Title>
              <Text>Last emptied: </Text>
              <Text>Container: {data?.container ? (
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
              )} </Text>
              <Text>Location: {data?.sensor.location}</Text>
              <Text>Description:</Text>
              <Textarea value={data?.sensor.description} disabled />
              <div className="items-left justify-left my-4 flex flex-row gap-x-4">
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
        </div></>
        
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
