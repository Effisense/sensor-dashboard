import { Button } from "@/ui/Button";
import H1 from "@/ui/typography/H1";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { Textarea } from "@/ui/Textarea";
import H4 from "@/ui/typography/H4";
import Alert from "@/ui/Alert";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import useGetContainerWithSensors from "@/hooks/queries/useGetContainerWithSensors";
import LoadingSpinner from "@/ui/LoadingSpinner";

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
      <H1>{container?.name}</H1>
      <div className="items-left justify-left my-4 flex flex-col">
        <H4>Height</H4>
        <p>{container?.binHeightInMillimeters}</p>
        <H4>Width</H4>
        <p>{container?.binWidthInMillimeters}</p>
        <H4>Volume</H4>
        <p>{container?.containerVolumeInLiters}</p>
        <H4>Description</H4>
        <Textarea value={container?.description} disabled />
        <H4>Sensors:</H4>
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
      <div className="items-left justify-left my-4 flex flex-row gap-x-4">
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
          title="Are you sure you want to delete the container??"
          description="The container? will be deleted, and removed from all sensors that are currently using it."
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
