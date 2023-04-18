import { Button } from "@/ui/Button";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Alert from "@/ui/Alert";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import useGetContainerWithSensors from "@/hooks/queries/useGetContainerWithSensors";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { Card, Text, Title } from "@tremor/react";
import { Divider } from "@tremor/react";
import SeverityToIcon from "@/ui/utils/SeverityToIcon";

type ContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ContainerPage = ({ id }: ContainerPageProps) => {
  const { container, sensors, loading, deleteContainerMutation } =
    useGetContainerWithSensors({ id });

  const onDelete = async () => {
    await deleteContainerMutation({ containerId: id });
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && container && (
        <div className="flex flex-col items-center justify-center gap-x-8 md:flex-row">
          <div className=" mt-8">
            <AllSensorsMap sensors={sensors} />
          </div>
          <div className="mt-4 flex flex-col gap-y-4">
            <div className="max-h-42 flex flex-col gap-y-1 overflow-x-hidden">
              {sensors &&
                sensors.map((sensor) => (
                  <Card
                    key={sensor.id}
                    className="m-px mx-auto flex max-h-7 w-[262px] flex-col justify-center"
                  >
                    <div className="flex flex-row gap-x-2">
                      {/* TODO: Add real fill level */}
                      <div className="flex max-w-xs items-center justify-center rounded bg-red-600 px-1 text-xs text-white">
                        54%
                      </div>
                      <Link
                        className="hover:underline"
                        href={`/sensors/${sensor.id}`}
                      >
                        <Text>{sensor.name}</Text>
                      </Link>
                      {/* TODO: change color if sensor not online */}
                      {SeverityToIcon("success")}
                    </div>
                  </Card>
                ))}
            </div>
            <Card className="mx-auto flex max-w-sm flex-col">
              <div className="mb-4 flex flex-row gap-x-2">
                <Title>{container?.name}</Title>
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="flex flex-row justify-between">
                  <Text>Height</Text>
                  <Text>{container.binHeightInMillimeters}</Text>
                </div>
                <Divider className="mb-1 mt-1" />
                <div className="flex flex-row justify-between">
                  <Text>Width</Text>
                  <Text>{container.binWidthInMillimeters}</Text>
                </div>
                <Divider className="mb-1 mt-1" />
                <div className="flex flex-row justify-between">
                  <Text>Volume</Text>
                  <Text>{container.containerVolumeInLiters}</Text>
                </div>
                <Divider className="mb-1 mt-1" />
                <div className="flex flex-row justify-between">
                  <Text>Target fill-level</Text>
                  <Text>{container.targetFillLevelInPercent}</Text>
                </div>
                <Divider className="mb-1 mt-1" />
                <Card className="mx-auto mt-2 max-w-xs">
                  <Text>{container.description}</Text>
                </Card>
              </div>
              <div className="items-left justify-left my-4 mt-4 flex flex-row gap-x-4">
                <Link href={`/containers/${id}/update`}>
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

export default ContainerPage;
