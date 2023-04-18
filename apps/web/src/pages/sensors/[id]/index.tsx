import { Button } from "@/ui/Button";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { PencilIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Alert from "@/ui/Alert";
import useGetSensor from "@/hooks/queries/useGetSensor";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { Card, Text, Title } from "@tremor/react";
import SeverityToIcon from "@/ui/utils/SeverityToIcon";

type SensorPageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const SensorPage = ({ id }: SensorPageProps) => {
  const { data, isLoading, deleteSensorMutation } = useGetSensor({ id });

  const onDelete = async () => {
    await deleteSensorMutation({ sensorId: id });
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && data && (
        <div className="flex flex-col items-center justify-center gap-x-8 gap-y-4 md:flex-row">
          <div className="mt-8">
            <AllSensorsMap sensors={[data.sensor]} />
          </div>
          <div>
            <Card
              className="mx-auto flex max-w-sm flex-col gap-y-4"
              decoration="top"
              decorationColor="teal"
            >
              <div className="flex flex-row gap-x-2">
                {/**TODO add real fillLevel*/}
                <div className="flex w-[35px] max-w-xs items-center justify-center rounded bg-red-600 text-xs text-white">
                  54%
                </div>
                <Title>{data?.sensor.name}</Title>
                {/**TODO change color if sensor not online*/}
                {SeverityToIcon("success")}
              </div>
              <div className="mt-4 flex flex-row gap-x-2">
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
                  trigger={
                    <Button
                      variant="subtle"
                      className="flex items-center justify-center gap-x-2"
                    >
                      <TrashIcon className="w-4" />
                      <span>Delete</span>
                    </Button>
                  }
                  onDelete={onDelete}
                />
              </div>
            </Card>
          </div>
        </div>
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
