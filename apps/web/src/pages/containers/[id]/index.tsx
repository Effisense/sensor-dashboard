import { Button } from "@/ui/Button";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Alert from "@/ui/Alert";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import useGetContainerWithSensors from "@/hooks/queries/useGetContainerWithSensors";
import LoadingSpinner from "@/ui/LoadingSpinner";
import AllSensorsMap from "@/ui/map/AllSensorsMap";
import { Card, Text } from "@tremor/react";
import { Divider } from "@tremor/react";
import { cn } from "@/utils/tailwind";
import { ScrollArea } from "@/ui/ScrollArea";
import DashboardSensorCard from "@/ui/DashboardSensorCard";
import H3 from "@/ui/typography/H3";
import Subtle from "@/ui/typography/Subtle";

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
    <div className="grid min-h-[calc(100vh-6rem)] w-11/12 grid-row-1 gap-y-4 md:w-full md:gap-x-2 md:px-4 lg:grid-cols-4 lg:gap-y-0">
      {!loading && container && (
        <>
        <div className={cn(
          " w-full rounded-lg lg:col-start-1 grid grid-col",
          "bg-slate-50 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
          "flex justify-start items-center flex-col p-4"
        )}>
        <div className="mb-4 flex items-center flex-col mt-4">
          <H3>{container?.name}</H3>
          <Subtle>Information about your container</Subtle>
        </div>
        <Card className="p-4 mx-auto flex max-w-sm flex-col">
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
              <Card className="mx-auto mt-1 max-w-xs">
                <Text>{container.description}</Text>
              </Card>
            </div>
            <div className="items-left justify-left mt-4 flex flex-row gap-x-4">
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

        <div className="row-start-1 h-96 lg:col-span-2 lg:col-start-2 lg:h-auto">
            {sensors ? (
              <AllSensorsMap sensors={sensors} />
            ) : (
              <div className="flex items-center justify-center">
                <LoadingSpinner />
              </div>
            )}
        </div>

        <div className={cn(
          "p-4 w-full rounded-lg lg:col-start-4 grid grid-col",
          "bg-slate-50 shadow-md transition-all duration-300 hover:shadow-lg md:m-0",
          "flex justify-start items-center flex-col"
        )}>
        <div className="mb-2 flex items-center flex-col mt-4">
          <H3>Sensors</H3>
          <Subtle>Click a sensor to view more.</Subtle>
        </div>
          <ScrollArea className="h-[420px] rounded-md p-4">
            {sensors &&
              sensors.map((sensor, index) => (
                <div key={index} className="mb-4">
                <DashboardSensorCard sensor={sensor} fillLevel={50} />
              </div>
            ))}
            </ScrollArea>
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
