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

type ContainerPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

const ContainerPage = ({ id }: ContainerPageProps) => {
  const { container, sensors, loading, deleteContainerMutation } =
    useGetContainerWithSensors({ id });

  const onDelete = async () => {
    await deleteContainerMutation({ containerId: id });
  };

  // TODO: change textarea with card from tremor
  return (
    <div>
      {loading && <LoadingSpinner />}
      {!loading && container && (
                <><><div className="flex flex-row items-center justify-center gap-x-8">
          <div className=" mt-8">
            <AllSensorsMap sensors={sensors} />
          </div>
          <div className="flex-col flex gap-y-4 mt-4">
          <Card className="max-w-xs mx-auto">
              <Title>Sensors:</Title>
          <div className="flex gap-x-2 mt-4">
              <ul className="ml-8 list-disc">
                {sensors &&
                  sensors.map((sensor) => (
                    <li key={sensor.id}>
                      <Link
                        className="hover:underline"
                        href={`/sensors/${sensor.id}`}
                      >
                        {sensor.name}
                      </Link>
                    </li>
                  ))}
              </ul>
              </div>
          </Card>
            <Card className="max-w-sm mx-auto flex flex-col">
              <div className="flex-row flex gap-x-2 mb-4">
                <Title>{container?.name}</Title>
              </div>
              <div className="flex-row flex gap-x-36">
              <Text>Height</Text>
              <Text>{container.binHeightInMillimeters}</Text>
              </div>
              <Divider className="mb-2 mt-2"/>
              <div className="flex-row flex gap-x-36">
              <Text>Width</Text>
              <Text>{container.binWidthInMillimeters}</Text>
              </div>
              <Divider className="mb-2 mt-2" />
              <div className="flex-row flex gap-x-36">
              <Text>Volume</Text>
              <Text>{container.containerVolumeInLiters}</Text>
              </div>
              <Divider className="mb-2 mt-2"/>
              <div className="flex-row flex gap-x-24">
              <Text>Target fill-level</Text>
              <Text>{container.targetFillLevelInPercent}</Text>
              </div>
              <Card className="max-w-xs mx-auto mt-4">
                <Text>{container.description}</Text>
              </Card>
              <div className="items-left justify-left my-4 flex flex-row gap-x-4 mt-4">
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
        </div></><div>
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

export default ContainerPage;
