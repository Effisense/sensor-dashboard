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
        <div className="flex flex-col items-center justify-center">
          <H1>{data?.sensor.name}</H1>
          <div className="items-left justify-left my-4 flex flex-col">
            <H4>Location</H4>
            <p>{data?.sensor.location}</p>
            <H4>Container</H4>
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
            <H4>Description</H4>
            <Textarea value={data?.sensor.description} disabled />
          </div>
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
